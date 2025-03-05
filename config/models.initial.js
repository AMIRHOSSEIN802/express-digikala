const { Product, productDetail, productColor, productSize } = require("../modules/product/product.model");
const sequelize = require("./sequelize.config");

async function initDatabase () {
    Product.hasMany(productDetail , {foreignKey: "productId" , sourceKey: "id" , as: "details"});
    productDetail.belongsTo(Product, {foreignKey: "productId" , targetKey: "id"});

    Product.hasMany(productColor, {foreignKey: "productId", sourceKey: "id" ,as: "colors"});
    productColor.belongsTo(Product , {foreignKey: "productId" , targetKey: "id"});

    Product.hasMany(productSize , {foreignKey: "productId" , sourceKey: "id" , as : "sizes"});
    productSize.belongsTo(Product, {foreignKey: "productId" , targetKey: "id"});
    // await sequelize.sync({force : true}) 

}
module.exports = initDatabase