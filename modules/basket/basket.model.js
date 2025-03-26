const { DataTypes, col } = require("sequelize");
const sequelize = require("../../config/sequelize.config");

const Basket = sequelize.define("basket" , {
    id: {type : DataTypes.INTEGER , autoIncrement: true , primaryKey: true},
    userId: {type: DataTypes.INTEGER},
    productId : {type: DataTypes.INTEGER},
    sizeId: {type: DataTypes.INTEGER , allowNullL : true},
    colorId: {type: DataTypes.INTEGER , allowNullL : true},
    discountId: {type: DataTypes.INTEGER , allowNullL : true},
    count: {type: DataTypes.INTEGER},
}, {timestamps: false , modelName: "basket"});

module.exports = {
    Basket
}