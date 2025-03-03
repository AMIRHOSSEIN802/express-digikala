const createHttpError = require("http-error");
const { productTyps } = require("../../common/constant/product.const");
const { Product, productDetail, productColor } = require("./product.model");

async function createProduct(req, res, next) {
  try {
    const {
      title,
      description,
      type,
      price = undefined,
      discount = undefined,
      active_discount = undefined,
      count = undefined,
      details,
      colors,
      sizes,
    } = req.body;
    if (!Object.values(productTyps).includes(type)) {
      throw createHttpError(400, "Invalid product type");
    }

    const product = await Product.create({
      title,
      description,
      price,
      discount,
      active_discount,
      type,
      count
    });
    if (details && Array.isArray(details)) {
      let detailList = [];
      for (const item of details) {
        detailList.push({
          key: item?.key,
          value: item?.value,
          productId: product.id,
        });
      }
      if(detailList.length > 0) {
        await productDetail.bulkCreate(detailList);
      }
    }
    if (type === productTyps.Coloring) {
        if (colors && Array.isArray(colors)) {
            let colorList = [];
            for (const item of colors) {
              colorList.push({
                color_name: item?.name,
                color_code: item?.code,
                productId: product.id,
                price: item.price,
                discountL: item.discount,
                active_discount: item.active_discount,
                count: item.count,
              });
            }
            if(colorList.length > 0) {
              await productColor.bulkCreate(colorList);
            }
          } 
    }
    if (type === productTyps.Sizing) {
        if (sizes && Array.isArray(sizes)) {
            let sizeList = [];
            for (const item of sizes) {
              sizeList.push({
                size: item?.size,
                productId: product.id,
                price: item?.price,
                discount: item.discount,
                active_discount: item.active_discount,
                count: item.count
              });
            }
            if(detailList.length > 0) {
              await productDetail.bulkCreate(detailList);
            }
          }
    }
  } catch (error) {
    next(error);
  }
}
