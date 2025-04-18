const { config } = require("dotenv");
const { User, Otp } = require("../user/user.model");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../user/refreshToken");
config();
async function sendOtpHandler (req , res , next) {
    try {
        const {mobile} = req.body;
        let code = Math.floor(Math.random() * 9999 - 10000) + 10000;
        let user = await User.findOne({
            where: {mobile}
        })
        let otp = null
        if(!user) {
            user = await User.create({
                mobile
            })
            otp = await Otp.create({
                code,
                expires_in: new Date(Date.now() + 1000 * 60),
                userId: user.id
            })
            return res.json({
                message : "otp send successfully",
                code
            })
        }
    } catch (error) {
        next(error)
    }
}
async function checkOtpHandler (req , res , next ) {
    try {
        const {mobile , code} = req.body;
        let user = await User.findOne({
            where: {mobile},
            include: [
                {model: Otp, as: "otp"}
            ]
        });
        if(!user){
            throw createHttpError(401, "not found user account")
        }
        if(user?.otp?.code !== code){
            throw createHttpError(401, "invalid otp")
        }
        if(user.otp.expires_in < new Date()){
            throw createHttpError(401, "otp expired")
        }
        const {accessToken , refreshToken} = generateToken({userId: user.id});
        return res.json({
            message: "otp verified successfully",
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error)
    }
}
function generateToken(payload) {
    const {ACCESS_TOKEN_SECRET , REFRESH_TOKEN_SECRET} = process.env;
    const accessToken = jwt.sign(payload , ACCESS_TOKEN_SECRET, {
        expiresIn: "7d"
    });
    const refreshToken = jwt.sign(payload , REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    });
    return {accessToken , refreshToken}
}

async function verifyRefreshToken(req , res , next) {
    try {
        const {refreshToken: token} = req.body;
        // console.log(refreshToken);
        
        if(!token) throw createHttpError(401, "login on your account");
        const verified = jwt.verify(token , process.env.REFRESH_TOKEN_SECRET);
        if (verified?.userId) {
            const user = await User.findByPk(verified?.userId);
            if (!user) throw createHttpError(401 , "login on your account");
            const existToken = await RefreshToken.findOne({
                where: {
                    token
                }
            });
            if (existToken) throw createHttpError(401 , "token expired");
            await RefreshToken.create({
                token,
                userId: user.id
            })
            const {accessToken , refreshToken} = generateToken({userId: user.id});
            return res.json({
                accessToken,
                refreshToken
            })
        }
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    sendOtpHandler,
    checkOtpHandler,
    verifyRefreshToken
}