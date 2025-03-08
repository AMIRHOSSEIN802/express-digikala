const { Product, productDetail, productColor, productSize } = require("../modules/product/product.model");
const { User, Otp } = require("../modules/user/user.model");
const sequelize = require("./sequelize.config");

async function initDatabase () {
    Product.hasMany(productDetail , {foreignKey: "productId" , sourceKey: "id" , as: "details"});
    productDetail.belongsTo(Product, {foreignKey: "productId" , targetKey: "id"});

    Product.hasMany(productColor, {foreignKey: "productId", sourceKey: "id" ,as: "colors"});
    productColor.belongsTo(Product , {foreignKey: "productId" , targetKey: "id"});

    Product.hasMany(productSize , {foreignKey: "productId" , sourceKey: "id" , as : "sizes"});
    productSize.belongsTo(Product, {foreignKey: "productId" , targetKey: "id"});

    User.hasOne(Otp, {foreignKey: "userId", as: "otp", sourceKey: "id"});
    Otp.hasOne(User, {foreignKey: "otpId", as: "otp" , sourceKey: "id"});
    Otp.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

    // await sequelize.sync({alter : true}) 

}
module.exports = initDatabase