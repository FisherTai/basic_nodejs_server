const { productValidation, productEditValidation } = require("../validation");
const { Product } = require("../models");
const ResultObject = require("../resultObject");

const createProduct = async (body, isAdmin) => {
  const { error } = productValidation(body);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(403, "Only Admin can Create Products");
  }

  const product = await Product.findOne({ product_name: body.product_name });
  if (product) {
    return new ResultObject(400, `${product.product_name} is already exist`);
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
    return new ResultObject(200, {
      msg: "success",
      product: saveProduct,
    });
  } catch (error) {
    return new ResultObject(500, "Product not saved.");
  }
};

const editProduct = async (_id, editContent, isAdmin) => {
  const { error } = productEditValidation(editContent);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(403, "Only Admin can update Products");
  }

  const editProduct = await Product.findOneAndUpdate({ _id }, editContent, {
    new: true,
    runValidators: true,
  });
  if (editProduct) {
    return new ResultObject(200, `Product updated : ${editProduct}`);
  } else {
    return new ResultObject(404, "Product not found.");
  }
};

const getProducts = async () => {
  try {
    const products = await Product.find({});
    if (products) {
      return new ResultObject(200, products);
    }
  } catch (err) {
    console.log(error);
    return new ResultObject(500, "Error");
  }
};

const getProduct = async (_id) => {
  try {
    const product = await Product.findOne({ _id });
    if (product) {
      return new ResultObject(200, product);
    } else {
      return new ResultObject(404, "Product not found.");
    }
  } catch (err) {
    console.log(err);
    return new ResultObject(500, "Error");
  }
};

const deleteProduct = async (_id, isHighest) => {
  if (!isHighest) {
    return new ResultObject(403, "Only Highest Admin can delete Products");
  }

  try {
    const product = await Product.findOneAndDelete({ _id });
    if (product) {
      return new ResultObject(200, {
        success: true,
        message: `Product deleted : ${product}`,
      });
    }
    return new ResultObject(404, {
      success: false,
      message: `Product not found`,
    });
  } catch (error) {
    return new ResultObject(500, {
      success: false,
      message: error,
    });
  }
};
module.exports = {
  createProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
};
