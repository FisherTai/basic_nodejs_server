const { productValidation, productEditValidation } = require("../validation");
const { Product } = require("../models");
const ResultObject = require("../resultObject");

const createProduct = (body, isAdmin) => new Promise((resolve, reject) => {
  const { error } = productValidation(body);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }

  if (!isAdmin) {
    reject(new ResultObject(403, "Only Admin can Create Products"));
    return;
  }

  Product.findOne({ product_name: body.product_name }).then((product) => {
    if (product) {
      reject(new ResultObject(400, `${product.product_name} is already exist`));
    } else {
      const newProduct = new Product({
        product_name: body.product_name,
        product_price: body.product_price,
        product_des: body.product_des,
        product_category: body.product_category,
      });

      try {
        newProduct.save().then((saveProduct) => {
          resolve(
            new ResultObject(200, {
              msg: "success",
              product: saveProduct,
            }),
          );
          console.log(`saved product: ${saveProduct}`);
        });
      } catch (err) {
        console.log(err);
        reject(new ResultObject(400, "Product not saved."));
      }
    }
  });
});

const editProduct = (_id, editContent, isAdmin) => new Promise((resolve, reject) => {
  const { error } = productEditValidation(editContent);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }
  Product.findOne({ _id }).then((product) => {
    if (!product) {
      reject(new ResultObject(404, "Product not found."));
    }
  });
  if (isAdmin) {
    Product.findOneAndUpdate({ _id }, editContent, {
      new: true,
      runValidators: true,
    }).then((product) => {
      resolve(new ResultObject(200, `Product updated : ${product}`));
    });
  } else {
    reject(new ResultObject(403, "Only Admin can update Products"));
  }
});

const getProducts = () => new Promise((resolve, reject) => {
  Product.find({})
    .then((products) => {
      resolve(new ResultObject(200, products));
    })
    .catch((error) => {
      console.log(error);
      reject(new ResultObject(500, "Error"));
    });
});

const getProduct = (_id) => new Promise((resolve, reject) => {
  Product.findOne({ _id })
    .then((product) => {
      if (product) {
        resolve(new ResultObject(200, product));
      } else {
        reject(new ResultObject(404, "Product not found."));
      }
    })
    .catch((error) => {
      console.log(error);
      reject(new ResultObject(500, "Error"));
    });
});

const deleteProduct = (_id, isHighest) => new Promise((resolve, reject) => {
  if (!isHighest) {
    reject(new ResultObject(403, "Only Highest Admin can delete Products"));
  } else {
    Product.deleteOne({ _id })
      .then((product) => {
        resolve(
          new ResultObject(200, {
            success: true,
            message: `Product deleted : ${product}`,
          }),
        );
      })
      .catch((error) => {
        reject(
          new ResultObject(500, {
            success: false,
            message: error,
          }),
        );
      });
  }
});

module.exports = {
  createProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
};
