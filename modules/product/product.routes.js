const { Router } = require("express");
const { createProductvalidation } = require("./validation");
const { createProductHandler, getProductHandler, getProductDetailsByIdHandler, removeProductHandler } = require("./product.service");

const router = Router();
router.post("/" ,createProductvalidation , createProductHandler);
router.get("/" , getProductHandler );
router.get("/:id" , getProductDetailsByIdHandler);
router.delete("/:id" , removeProductHandler);

module.exports = {
    productRouter : router
}
