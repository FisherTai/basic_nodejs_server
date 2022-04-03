const { productValidation, productEditValidation } = require("../validation");
const { Product } = require("../models");
const ResultObject = require("../result-object");
const { ResultCode } = require("../result-code");

const createProduct = async (body, isAdmin) => {
  const { error } = productValidation(body);
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(ResultCode.PRODUCT_NEED_ADMIN_PERMISSION);
  }

  const product = await Product.findOne({ product_name: body.product_name });
  if (product) {
    return new ResultObject(ResultCode.PRODUCT_EXIST);
  }

  const newProduct = new Product({
    product_name: body.product_name,
    product_price: body.product_price,
    product_des: body.product_des,
    product_category: body.product_category,
    product_shelves: body.product_shelves,
  });
  try {
    const saveProduct = await newProduct.save();
    console.log(`saved product: ${saveProduct}`);
    return new ResultObject(ResultCode.SUCCESS, saveProduct);
  } catch (err) {
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const editProduct = async (_id, editContent, isAdmin) => {
  const { error } = productEditValidation(editContent);
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(ResultCode.PRODUCT_NEED_ADMIN_PERMISSION);
  }

  const editedProduct = await Product.findOneAndUpdate({ _id }, editContent, {
    new: true,
    runValidators: true,
  });
  if (editedProduct) {
    return new ResultObject(ResultCode.SUCCESS, editedProduct);
  }
  return new ResultObject(ResultCode.PRODUCT_NOT_FOUND);
};

const getProducts = async () => {
  try {
    const products = await Product.find({});
    return new ResultObject(ResultCode.SUCCESS, products);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const getProduct = async (_id) => {
  try {
    const product = await Product.findOne({ _id });
    if (product) {
      return new ResultObject(ResultCode.SUCCESS, product);
    }
    return new ResultObject(ResultCode.PRODUCT_NOT_FOUND);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const deleteProduct = async (_id, isHighest) => {
  if (!isHighest) {
    return new ResultObject(ResultCode.PRODUCT_NEED_ADMIN_PERMISSION);
  }

  try {
    const product = await Product.findOneAndDelete({ _id });
    if (product) {
      return new ResultObject(ResultCode.SUCCESS, product);
    }
    return new ResultObject(ResultCode.PRODUCT_NOT_FOUND);
  } catch (error) {
    console.log(`deleteProduct: ${error}`);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};
module.exports = {
  createProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
};
