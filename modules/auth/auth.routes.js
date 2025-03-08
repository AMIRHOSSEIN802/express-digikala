const { Router } = require("express");
const { sendOtpHandler, checkOtpHandler, verifyRefreshToken } = require("./auth.service");

const router = Router();
router.post("/send-otp" , sendOtpHandler)
router.post("/check-otp" , checkOtpHandler)
router.post("/refresh-token" , verifyRefreshToken)

module.exports = {
    authRoutes : router
}