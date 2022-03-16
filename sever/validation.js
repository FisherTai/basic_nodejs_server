const Joi = require("joi");

// Register Validation

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(100).required()
      .email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid(["normal", "vip"]),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required()
      .email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });

  return schema.validate(data);
};

const productValidation = (data) => {
  const schema = Joi.object({
    product_name: Joi.string().min(2).max(30).required(),
    product_price: Joi.number().min(10).max(2000).required(),
    product_des: Joi.string().max(50).required(),
    product_category: Joi.string().required().valid("money", "gift"),
    product_pic: Joi.string(),
    product_shelves: Joi.boolean().required(),
  });
  return schema.validate(data);
};

const productEditValidation = (data) => {
  const schema = Joi.object({
    product_name: Joi.string().min(2).max(30),
    product_price: Joi.number().min(10).max(2000),
    product_des: Joi.string().max(50),
    product_category: Joi.string().valid("money", "gift"),
    product_pic: Joi.string(),
    product_shelves: Joi.boolean(),
  });
  return schema.validate(data);
};

const orderValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  courseValidation,
  productValidation,
  productEditValidation,
  orderValidation,
};
