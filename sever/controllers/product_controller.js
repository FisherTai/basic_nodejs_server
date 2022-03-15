const { productValidation } = require("../validation");
const { Product } = require("../models");
const ResultObject = require("../resultObject");

const createProduct = (req) =>
  new Promise((resolve, reject) => {
    const { error } = productValidation(req.body);
    if (error) {
      reject(new ResultObject(400, error.details[0].message));
      return;
    }

    Product.findOne({ product_name: req.body.product_name }).then((product) => {
      if (product) {
        reject(new ResultObject(400, `${product.name} is already exist`));
      } else {
        const newProduct = new Product({
          product_name: req.body.product_name,
          product_price: req.body.product_price,
          product_des: req.body.product_des,
          product_category: req.body.product_category,
        });

        try {
          newProduct.save().then((saveProduct) => {
            resolve(
              new ResultObject(200, {
                msg: "success",
              })
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

const editProduct = (_id, editContent, isAdmin) =>
  new Promise((resolve, reject) => {
    const { error } = productValidation(editContent);
    if (error) {
      reject(new ResultObject(400, error.details[0].message));
      return;
    }
    Product.findOne({ _id }).then((product) => {
      if (!product) {
        reject(new ResultObject(404, "Product not found."));
      }
      return;
    });
    if (isAdmin()) {
      Product.findOneAndUpdate({ _id }, editContent, {
        new: true,
        runValidators: true,
      }).then((product) => {
        resolve(new ResultObject(200, `Product update : ${product}`));
      });
    } else {
      reject(new ResultObject(403, "Only Admin can update Products"));
    }
  });

const getProducts = () =>
  new Promise((resolve, reject) => {
    Product.find({})
      .then((products) => {
        resolve(new ResultObject(200, products));
      })
      .catch((error) => {
        console.log(error);
        reject(new ResultObject(500, "Error"));
      });
  });

const getProduct = (_id) =>
  new Promise((resolve, reject) => {
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

const deleteProduct = (_id, isAdmin) =>
  new Promise((resolve, reject) => {
    if (isAdmin()) {
      reject(new ResultObject(403, "Only Admin can delete Products"));
    } else {
      Product.deleteOne({ _id })
        .then((product) => {
          resolve(new ResultObject(200, {
            success: false,
            message: `Product deleted : ${product}`,
          }));
        })
        .catch((error) => {
          reject(
            new ResultObject(500, {
              success: false,
              message: err,
            })
          );
        });
    }
  });
