const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize.config");
const { productTyps } = require("../../common/constant/product.const");

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title:{type: DataTypes.STRING,},
    price: {type: DataTypes.DECIMAL, allowNull: true},
    discount: {type: DataTypes.INTEGER, allowNull: true},
    active_discount: {type: DataTypes.BOOLEAN, defaultValue:true , allowNull: true},
    type: {type: DataTypes.ENUM(Object.values(productTyps))},
    count : {type: DataTypes.INTEGER , defaultValue: 0},
    description: {type: DataTypes.TEXT},
}, {
    modelName: 'product',
    createdAt: 'created_at',
    updatedAt: ':updated_at',
});
const productDetail = sequelize.define('product_detail', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    key: {type: DataTypes.STRING},
    value: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
}, {
    timestamps: false,
    modelName: "product_detail"
})
const productColor = sequelize.define('product_color', {
    id : {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    color_name: {type: DataTypes.STRING},
    color_code: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.DECIMAL, defaultValue: 0},
    discount: {type: DataTypes.INTEGER, allowNull : true},
    active_discount: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    timestamps: false,
    modelName: "product_color"
});
const productSize = sequelize.define('product_size', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    size: {type: DataTypes.STRING},
    productId: {type: DataTypes.INTEGER},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.DECIMAL, defaultValue: 0},
    discount: {type: DataTypes.INTEGER, allowNull: true},
    active_discount: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {
    timestamps: false,
    modelName: "product_size"
})

module.exports = {
    Product,
    productDetail,
    productColor,
    productSize
}