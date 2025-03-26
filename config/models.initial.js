const { Basket } = require("../modules/basket/basket.model");
const { Discount } = require("../modules/discount/discount.model");
const { Order, OrderItem } = require("../modules/order/order.model");
const { Payment } = require("../modules/payment/payment.model");
const { Product, productDetail, productColor, productSize } = require("../modules/product/product.model");
const { RefreshToken } = require("../modules/user/refreshToken");
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

    Product.hasMany(Basket, {foreignKey: "productId", sourceKey: "id", as: "basket"});
    productColor.hasMany(Basket, {foreignKey: "colorId", sourceKey: "id", as: "basket"});
    productSize.hasMany(Basket, {foreignKey: "sizeId", sourceKey: "id", as: "basket"});
    User.hasMany(Basket, {foreignKey: "userId", sourceKey: "id", as: "basket"});
    Discount.hasMany(Basket, {foreignKey: "discountId", sourceKey: "id", as: "basket"});

    Basket.belongsTo(Product, {foreignKey: "productId", targetKey: "id" , as : "product"});
    Basket.belongsTo(User, {foreignKey: "userId", targetKey: "id" , as : "user"});
    Basket.belongsTo(productColor, {foreignKey: "colorId", targetKey: "id" , as : "color"});
    Basket.belongsTo(productSize, {foreignKey: "sizeId", targetKey: "id" , as : "size"});
    Basket.belongsTo(Discount, {foreignKey: "discountId", targetKey: "id" , as : "discount"});

    Order.hasMany(OrderItem, {foreignKey: "orderId", sourceKey: "id", as: "items"});
    User.hasMany(Order, {foreignKey: "userId", sourceKey: "id", as: "orders"});
    OrderItem.belongsTo(Order, {foreignKey: "orderId", targetKey: "id"});

    Order.hasOne(Payment, {foreignKey: "orderId" , as: "payment" , sourceKey: "id"});
    Payment.hasOne(Order, {foreignKey: "paymentId" , as: "order" , sourceKey: "id"});
    // RefreshToken.sync()
    // Discount.sync()
    // Basket.sync()
    // await sequelize.sync({alter : true})  
    

}
module.exports = initDatabase