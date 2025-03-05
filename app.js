const { config } = require('dotenv');
const express = require('express');
const sequelize = require('./config/sequelize.config');
const initDatabase = require('./config/models.initial');
const { productRouter } = require('./modules/product/product.routes');
const morgan = require('morgan');
config();
async function main() {
    const app = express();
    app.use(morgan("dev"))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await initDatabase()
    app.use("/product" , productRouter)
    app.use((req , res , next) => {
        return res.status(404).json({
            message : "not fund route"
        })
    })
    app.use((err , req , res , next) => {
        const status = err?.status ?? err?.statusCode ?? 500;
        let message = err?.message ?? "internal server error";
        if(err?.name == "ValidationError") {
            const { details } = err;
            message = details?.body?.[0]?.message ?? "internal server error"
        }
        return res.status(status).json({
            message,
        })
    })
    let port = process.env.PORT || 3000;
    app.listen(port , () => {
        console.log("server run: http://localhost:" + port); 
    })
}
main();