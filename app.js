const { config } = require('dotenv');
const express = require('express');
const sequelize = require('./config/sequelize.config');
const initDatabase = require('./config/models.initial');
config();
async function main() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await initDatabase()
    app.use((req , res , next) => {
        return res.status(404).json({
            message : "not fund route"
        })
    })
    app.use((err , req , res , next) => {
        const status = err.status || 500;
        const message = err.message || "internal server error";
        return res.status(status).json({
            message
        })
    })
    let port = process.env.PORT || 3000;
    app.listen(port , () => {
        console.log("server run: http://localhost:" + port);
    })
}
main();