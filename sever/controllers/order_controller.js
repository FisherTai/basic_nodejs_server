/* eslint-disable camelcase */
const { orderValidation } = require("../validation");
const { Order } = require("../models");
const ResultObject = require("../result-object");
const { ResultCode } = require("../result-code");

// TODO
const createOrder = async (user_id, product_id) => {
  if (!user_id) {
    return new ResultObject(ResultCode.USER_NOT_LOGIN);
  }

  if (!product_id) {
    return new ResultObject(ResultCode.PRODUCT_NOT_FOUND);
  }

  const newOrder = new Order({
    user_id,
    product_id,
  });

  const { error } = orderValidation({ user_id, product_id });
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, { msg: error.details[0].message });
  }

  try {
    const saved = await newOrder.save();
    console.log(`create Order: ${saved}`);
    return new ResultObject(ResultCode.SUCCESS, saved);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};
const updateOrder = async (_id, body, isAdmin) => {
  const { error } = orderValidation(body);
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, error.details[0].message);
  }

  if (!isAdmin) {
    return new ResultObject(ResultCode.NEED_ADMIN_PERMISSION);
  }

  const updated = await Order.findOneAndUpdate({ _id }, body, {
    new: true,
    runValidators: true,
  });

  if (updated) {
    return new ResultObject(ResultCode.SUCCESS, updated);
  }

  return new ResultObject(ResultCode.ORDER_NOT_FOUND);
};

const getOrders = async () => {
  try {
    const orderList = await Order.find({});
    return new ResultObject(ResultCode.SUCCESS, orderList);
  } catch (error) {
    console.log(error);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const getUserOrders = async (user_id) => {
  try {
    const orderList = await Order.find({ user_id });
    return new ResultObject(ResultCode.SUCCESS, orderList);
  } catch (error) {
    console.log(error);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const getOrder = async (_id) => {
  Order.findOne({ _id })
    .then((order) => {
      if (order) {
        return new ResultObject(ResultCode.SUCCESS, order);
      }
      return new ResultObject(ResultCode.ORDER_NOT_FOUND);
    })
    .catch((error) => {
      console.log(error);
      return new ResultObject(ResultCode.UNEXPECTED_ERROR);
    });
};

const deleteOrders = async (_id, isHighest) => {
  if (!isHighest) {
    return new ResultObject(ResultCode.NEED_ADMIN_PERMISSION, {
      msg: "Only Highest Admin can delete order",
    });
  }

  try {
    const order = await Order.deleteOne({ _id });
    return new ResultObject(ResultCode.SUCCESS, order);
  } catch (error) {
    return new ResultObject(ResultCode.UNEXPECTED_ERROR, {
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
