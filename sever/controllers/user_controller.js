/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const { User, Product } = require("../models");
const ResultObject = require("../resultObject");

/**
 * Website register
 * @param {*request from router} req
 * @param {*} res
 * @returns
 */
const register = async (req) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return new ResultObject(400, error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return new ResultObject(400, "Email has already been regestered");
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
    return new ResultObject(200, {
      msg: "success",
      savedObject: savedUser,
    });
  } catch (err) {
    console.log(err);
    return new ResultObject(400, "User not saved.");
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
    return new ResultObject(400, error.details[0].message);
  }

  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return new ResultObject(400, "user not found");
    }
    if (!user.password) {
      return new ResultObject(400, "please try to login using google");
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
      return new ResultObject(200, {
        success: true,
        token: `JWT ${token}`,
        user,
      });
    }
    return new ResultObject(401, "Wrong password");
  } catch (err) {
    return new ResultObject(500, err);
  }
};

const googleAccountLogin = (profile) => new Promise((resolve) => {
  User.findOne({ googleID: profile.id }).then((foundUser) => {
    if (foundUser) {
      // Google login
      console.log(`${profile.emails[0].value} User already exist`);
      return resolve(foundUser);
    }
    // Create google account in db
    const newUserBody = {
      username: profile.displayName,
      googleID: profile.id,
      thumbnail: profile.photos[0].value,
      email: profile.emails[0].value,
    };
    User.findOneAndUpdate({ email: profile.emails[0].value }, newUserBody, {
      new: true,
      runValidators: true,
    })
      .then((foundUpdateUser) => {
        if (foundUpdateUser) {
          console.log(`User connected google. \n${foundUpdateUser}`);
          return resolve(foundUpdateUser);
        }
        const newUser = User(newUserBody).save();
        console.log(newUser);
        return resolve(newUser);
      })
      .catch((err) => {
        console.log(err);
      });
    return null;
  });
});

const buyProduct = async (userId, productId) => {
  try {
    const updateUser = await User.findOne({ _id: userId });
    const product = await Product.findOne({ _id: productId });
    if (!updateUser || !product) {
      return new ResultObject(404, `Not found user or product`);
    }
    if (updateUser.money < product.product_price) {
      return new ResultObject(400, `Money not enough`);
    }
    updateUser.updateOne(
      {
        $addToSet: { products: product._id },
        $set: { money: updateUser.money - product.product_price },
      },
    );
    return new ResultObject(200, `user state update success`);
  } catch (err) {
    console.log(err);
    return new ResultObject(500, `update fail:${err}`);
  }
};

module.exports = {
  login,
  register,
  googleAccountLogin,
  buyProduct,
};
