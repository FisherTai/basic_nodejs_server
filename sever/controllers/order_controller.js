/* eslint-disable camelcase */
const { orderValidation } = require("../validation");
const { Order } = require("../models");
const ResultObject = require("../resultObject");

// TODO
const createOrder = async (user_id, product_id) => {
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

  const { error } = orderValidation({ user_id, product_id });
  if (error) {
    return new ResultObject(400, { msg: error.details[0].message });
  }

  try {
    const saved = await newOrder.save();
    console.log(`create Order: ${saved}`);
    return new ResultObject(200, {
      msg: "create success",
      item: saved,
    });
  } catch (err) {
    console.log(err);
    return new ResultObject(400, { msg: "Order not create." });
  }
};
const updateOrder = async (_id, body, isAdmin) => {
  const { error } = orderValidation(body);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(403, { msg: "Only Admin can update order" });
  }

  const updated = await Order.findOneAndUpdate({ _id }, body, {
    new: true,
    runValidators: true,
  });

  if (updated) {
    return new ResultObject(200, { msg: "updated success", item: updated });
  }

  return new ResultObject(404, { msg: "order not found." });
};

const getOrders = async () => {
  try {
    const orderList = await Order.find({});
    return new ResultObject(200, { msg: "success", item: orderList });
  } catch (error) {
    console.log(error);
    return new ResultObject(500, { msg: "Error" });
  }
};

const getUserOrders = async (user_id) => {
  try {
    const orderList = await Order.find({ user_id });
    return new ResultObject(200, { msg: "success", item: orderList });
  } catch (error) {
    console.log(error);
    return new ResultObject(500, { msg: "Error" });
  }
};

const getOrder = async (_id) => {
  Order.findOne({ _id })
    .then((order) => {
      if (order) {
        return new ResultObject(200, { msg: "success", item: order });
      }
      return new ResultObject(404, { msg: "order not found." });
    })
    .catch((error) => {
      console.log(error);
      return new ResultObject(500, { msg: "Error" });
    });
};

const deleteOrders = async (_id, isHighest) => {
  if (!isHighest) {
    return new ResultObject(403, {
      msg: "Only Highest Admin can delete order",
    });
  }

  try {
    const order = await Order.deleteOne({ _id });
    return new ResultObject(200, {
      msg: "order deleted",
      item: order,
    });
  } catch (error) {
    return new ResultObject(500, {
      msg: error,
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrder,
  getOrders,
  getUserOrders,
  deleteOrders,
};
