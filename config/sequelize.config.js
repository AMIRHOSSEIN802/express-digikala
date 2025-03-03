const { config } = require("dotenv");
const { Sequelize } = require("sequelize");
config(); 
const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false 
})
sequelize.authenticate().then(() => {
    console.log("database is connected");
}).catch((err) => {
    console.log("database is not connected");
});
module.exports = sequelize;