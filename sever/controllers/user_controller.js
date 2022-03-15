/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const { User } = require("../models");
const ResultObject = require("../resultObject");

/**
 * Website register
 * @param {*request from router} req
 * @param {*} res
 * @returns
 */
const register = (req) => new Promise((resolve, reject) => {
  const { error } = registerValidation(req.body);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      reject(new ResultObject(400, "Email has already been regestered"));
    } else {
      // create user
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      });

      try {
        newUser.save().then((savedUser) => {
          resolve(
            new ResultObject(200, {
              msg: "success",
              savedObject: savedUser,
            }),
          );
        });
      } catch (err) {
        console.log(err);
        reject(new ResultObject(400, "User not saved."));
      }
    }
  });
});

/**
 * Website Login
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = (req) => new Promise((resolve, reject) => {
  const { error } = loginValidation(req.body);
  if (error) {
    reject(new ResultObject(400, error.details[0].message));
    return;
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      reject(new ResultObject(400, err));
      return;
    }
    if (!user) {
      reject(new ResultObject(401, "user not found"));
      return;
    }
    user.comparePassword(req.body.password, (compareErr, isMatch) => {
      if (compareErr) {
        return reject(new ResultObject(400, compareErr));
      }
      if (isMatch) {
        const tokenObject = {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
        return resolve(
          new ResultObject(200, {
            success: true,
            token: `JWT ${token}`,
            user,
          }),
        );
      }
      return reject(new ResultObject(401, "Wrong password"));
    });
  });
});

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

module.exports = {
  login,
  register,
  googleAccountLogin,
};
