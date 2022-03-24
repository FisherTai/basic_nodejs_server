/* eslint-disable camelcase */
const { orderValidation } = require("../validation");
const { Order } = require("../models");
const ResultObject = require("../resultObject");

// TODO
const createOrder = async (body) => {
  const { error } = orderValidation(body);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  const { user_id, product_id } = body;

  if (!user_id) {
    return new ResultObject(401, { msg: "please login" });
  }

  if (!product_id) {
    return new ResultObject(401, { msg: "not found this product" });
  }

  const newOrder = new Order({
    user_id,
    product_id,
  });

  try {
    const saved = newOrder.save();
    console.log(`create Order: ${saved}`);
    return new ResultObject(200, {
      msg: "success",
      product: saved,
    });
  } catch (err) {
    console.log(err);
    return new ResultObject(400, "Order not create.");
  }
};
const updateOrder = async (_id, body, isAdmin) => {
  const { error } = orderValidation(body);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(403, "Only Admin can update order");
  }

  const updated = await Order.findOneAndUpdate({ _id }, body, {
    new: true,
    runValidators: true,
  });

  if (updated) {
    return new ResultObject(200, `order updated : ${updated}`);
  }

  return new ResultObject(404, "order not found.");
};

const getOrders = async () => {
  Order.find({})
    .then((order) => new ResultObject(200, order))
    .catch((error) => {
      console.log(error);
      return new ResultObject(500, "Error");
    });
};

const getOrder = async (_id) => {
  Order.findOne({ _id })
    .then((order) => {
      if (order) {
        return new ResultObject(200, order);
      }
      return new ResultObject(404, "order not found.");
    })
    .catch((error) => {
      console.log(error);
      return new ResultObject(500, "Error");
    });
};

const deleteOrders = async (_id, isHighest) => {
  if (!isHighest) {
    return new ResultObject(403, "Only Highest Admin can delete order");
  }

  try {
    const order = await Order.deleteOne({ _id });
    return new ResultObject(200, {
      success: true,
      message: `order deleted : ${order}`,
    });
  } catch (error) {
    return new ResultObject(500, {
      success: false,
      message: error,
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrder,
  getOrders,
  deleteOrders,
};
