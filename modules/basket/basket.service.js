const { productTyps } = require("../../common/constant/product.const");
const {
  Product,
  productColor: ProductColor,
  productSize: ProductSize,
} = require("../product/product.model");
const createHttpError = require("http-errors");
const { Basket } = require("./basket.model");

async function addToBasketHandler(req, res, next) {
  try {
    const { id: userId = undefined } = req?.user ?? {};
    const { productId, colorId, sizeId } = req.body;
    if (!userId) throw createHttpError(401, "User not authenticated");

    const product = await Product.findByPk(productId);
    if (!product) throw createHttpError(404, "Product not found");

    const basketItem = {
      productId: product.id,
      userId,
    };

    let productCount = undefined;
    let colorCount = undefined;
    let sizeCount = undefined;

    if (product.type === productTyps.Coloring) {
      if (!colorId) throw createHttpError(400, "send product color details");
      const productColor = await ProductColor.findByPk(colorId);
      if (!productColor) throw createHttpError(404, "Color not found");
      basketItem["colorId"] = colorId;
      colorCount = productColor?.count ?? 0;
      if (colorCount === 0) throw createHttpError(400, "Color out of stock");
    } else if (product.type === productTyps.Sizing) {
      if (!sizeId) throw createHttpError(400, "send product size details");
      const productSize = await ProductSize.findByPk(sizeId);
      if (!productSize) throw createHttpError(404, "Size not found");
      basketItem["sizeId"] = sizeId;
      sizeCount = productSize?.count ?? 0;
      if (sizeCount === 0) throw createHttpError(400, "Size out of stock");
    } else {
      productCount = product?.count ?? 0;
      if (productCount === 0)
        throw createHttpError(400, "Product out of stock");
    }

    const basket = await Basket.findOne({ where: basketItem });
    if (basket) {
      if (sizeCount && sizeCount > basket?.count) {
        basket.count += 1;
      } else if (colorCount && colorCount > basket?.count) {
        basket.count += 1;
      } else if (productCount && productCount > basket?.count) {
        basket.count += 1;
      } else {
        throw createHttpError(400, "Product count not enough");
      }
      await basket.save();
    } else {
      await Basket.create({ ...basketItem, count: 1 });
    }

    return res.json({ message: "Product added to basket" });
  } catch (error) {
    console.error("Error adding to basket:", error);
    next(error);
  }
}
async function getUserBasketHandler(req, res, next) {
  try {
    const { id: userId } = req.user;
    const basket = await Basket.findAll({
      where: { userId },
      include: [
        { model: Product, as: "product" },
        { model: ProductColor, as: "color" },
        { model: ProductSize, as: "size" },
      ],
    });
     let totalAmount = 0;
     let totalDiscount = 0;
     let finalAmount = 0;
     let finalBasket = [];
     for (const item of basket) {
      const { product, color, size, count } = item;
      const productIndex = finalBasket.findIndex((item) => item.id === product.id);
      let productData = finalBasket.find((item) => item.id === product.id);
      if (!productData) {
        productData = {
         id: product.id,
         title: product.title,
         price: product.price,
         type: product.type,
         count,
         sizes: [],
         colors: [],
       };
      }else{
        productData.count += count;
      }
      if (product?.type === productTyps.Coloring && color) {
        let price = color.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = price;
        if (color?.active_discount && color?.discount > 0) {
          discountAmount = price * (color?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = (price - discountAmount);
        finalAmount += finalPrice;
        productData["colors"].push({
          id: color.id,
          color_name: color?.color_name,
          color_code: color?.color_code,
          price,
          discountAmount,
          finalAmount,
          count,
        })
      }else if (product?.type === productTyps.Sizing && size) {
        let price = size.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = price;
        if (size?.active_discount && size?.discount > 0) {
          discountAmount = price * (size?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = (price - discountAmount);
        finalAmount += finalPrice;
        productData["sizes"].push({
          id: size.id,
          size: size?.size,
          price,
          discountAmount,
          finalAmount,
          count,
        })
      }else if (product?.type === productTyps.Single && product) {
        let price = product.price * count;
        totalAmount += price;
        let discountAmount = 0;
        let finalPrice = price;
        if (product?.active_discount && product?.discount > 0) {
          discountAmount = price * (product?.discount / 100);
          totalDiscount += discountAmount;
        }
        finalPrice = (price - discountAmount);
        finalAmount += finalPrice;
        productData["finalPrice"] = finalPrice;
        productData["discountAmount"] = discountAmount;
      }
      if (productIndex > -1) finalBasket[productIndex] = productData;
      else finalBasket.push(productData);
     }
    return res.json({ 
      totalAmount,
      totalDiscount,
      finalAmount,
      basket : finalBasket});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToBasketHandler,
  getUserBasketHandler,
};
