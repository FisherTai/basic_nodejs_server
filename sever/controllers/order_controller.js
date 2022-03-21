/* eslint-disable camelcase */
const { orderValidation } = require("../validation");
const { Order, User, Product } = require("../models");
const ResultObject = require("../resultObject");

// TODO
const createOrder = (body) => new Promise((resolve, reject) => {
  const { error } = orderValidation(body);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }

  const { user_id, product_id } = body;

  if (!user_id) {
    reject(new ResultObject(401, { msg: "please login" }));
    return;
  }

  if (!product_id) {
    reject(new ResultObject(401, { msg: "not found this product" }));
    return;
  }

  const newOrder = new Order({
    user_id,
    product_id,
  });

  try {
    newOrder.save().then((saveOrder) => {
      resolve(
        new ResultObject(200, {
          msg: "success",
          product: saveOrder,
        }),
      );
      console.log(`create Order: ${saveOrder}`);
    });
  } catch (err) {
    console.log(err);
    reject(new ResultObject(400, "Order not create."));
  }
});
const updateOrder = (_id, body, isAdmin) => new Promise((resolve, reject) => {
  const { error } = orderValidation(body);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }
  Order.findOne({ _id }).then((order) => {
    if (!order) {
      reject(new ResultObject(404, "order not found."));
    }
  });
  if (isAdmin) {
    Order.findOneAndUpdate({ _id }, body, {
      new: true,
      runValidators: true,
    }).then((order) => {
      resolve(new ResultObject(200, `order updated : ${order}`));
    });
  } else {
    reject(new ResultObject(403, "Only Admin can update order"));
  }
});
const getOrders = () => new Promise((resolve, reject) => {
  Order.find({})
    .then((order) => {
      resolve(new ResultObject(200, order));
    })
    .catch((error) => {
      console.log(error);
      reject(new ResultObject(500, "Error"));
    });
});

const getOrder = (_id) => new Promise((resolve, reject) => {
  Order.findOne({ _id })
    .then((order) => {
      if (order) {
        resolve(new ResultObject(200, order));
      } else {
        reject(new ResultObject(404, "order not found."));
      }
    })
    .catch((error) => {
      console.log(error);
      reject(new ResultObject(500, "Error"));
    });
});
const deleteOrders = (_id, isHighest) => new Promise((resolve, reject) => {
  if (!isHighest) {
    reject(new ResultObject(403, "Only Highest Admin can delete order"));
  } else {
    Order.deleteOne({ _id })
      .then((order) => {
        resolve(
          new ResultObject(200, {
            success: true,
            message: `order deleted : ${order}`,
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
  createOrder,
  updateOrder,
  getOrder,
  getOrders,
  deleteOrders,
};
