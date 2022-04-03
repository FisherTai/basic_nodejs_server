/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const { User, Product } = require("../models");
const ResultObject = require("../result-object");
const { ResultCode } = require("../result-code");

/**
 * Website register
 * @param {*request from router} req
 * @param {*} res
 * @returns
 */
const register = async (req) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return new ResultObject(ResultCode.USER_EMAIL_EXIST);
  }
  // create user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });

  try {
    const savedUser = await newUser.save();
    return new ResultObject(ResultCode.SUCCESS, savedUser);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

/**
 * Website Login
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = async (body) => {
  const { error } = loginValidation(body);
  if (error) {
    return new ResultObject(ResultCode.PARAM_ERROR, error.details[0].message);
  }

  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return new ResultObject(ResultCode.USER_NOT_FOUND);
    }
    if (!user.password) {
      return new ResultObject(ResultCode.USER_TRY_GOOGLE);
    }
    const isMatch = await user.comparePassword(body.password, user.password);
    if (isMatch) {
      const tokenObject = {
        _id: user._id,
        email: user.email,
        role: user.role,
        expiresIn: "7d",
      };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return new ResultObject(ResultCode.SUCCESS, {
        token: `JWT ${token}`,
        user,
      });
    }
    return new ResultObject(ResultCode.USER_WRONG_PASSWORD);
  } catch (err) {
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

const googleAccountLogin = async (profile) => {
  try {
    const foundUser = await User.findOne({ googleID: profile.id });

    if (foundUser) {
      // Google login
      console.log(`${profile.emails[0].value} User already exist`);
      return foundUser;
    }
    // Create google account in db
    const newUserBody = {
      username: profile.displayName,
      googleID: profile.id,
      thumbnail: profile.photos[0].value,
      email: profile.emails[0].value,
    };

    const foundUpdateUser = await User.findOneAndUpdate(
      { email: profile.emails[0].value },
      newUserBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (foundUpdateUser) {
      console.log(`User connected google. \n${foundUpdateUser}`);
      return foundUpdateUser;
    }
    const newUser = await User(newUserBody).save();
    console.log(newUser);
    return newUser;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const buyProduct = async (userId, productId) => {
  try {
    // const updateUser = await User.findOne({ _id: userId });
    // const product = await Product.findOne({ _id: productId });
    // 兩個await同時進行
    const [updateUser, product] = await Promise.all([User.findOne({ _id: userId }),
      Product.findOne({ _id: productId })]);

    if (!updateUser || !product) {
      return new ResultObject(ResultCode.ORDER_DATA_ERROR);
    }

    if (updateUser.money < product.product_price) {
      return new ResultObject(ResultCode.USER_MONEY_ENOUGH);
    }

    await updateUser.updateOne(
      {
        $addToSet: { products: product._id },
        $set: { money: updateUser.money - product.product_price },
      },
    );

    return new ResultObject(ResultCode.SUCCESS);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

module.exports = {
  login,
  register,
  googleAccountLogin,
  buyProduct,
};
