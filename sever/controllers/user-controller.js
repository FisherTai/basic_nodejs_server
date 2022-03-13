const router = require("express").Router();
const { registerValidation, loginValidation } = require("../validation");
const { User } = require("../models/");

const jwt = require("jsonwebtoken");

class resultObject {
  constructor(statusCode, content) {
    this.statusCode = statusCode;
    this.content = content;
  }
}

/**
 * Website register
 * @param {*request from router} req
 * @param {*} res
 * @returns
 */
const register = (req) => {
  return new Promise(async (resolve, reject) => {
    const { error } = registerValidation(req.body);
    if (error) {
      return reject(new resultObject(400, error.details[0].message));
    }

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return reject(new resultObject(400, "Email has already been regestered"));
    }

    //create user
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    });

    try {
      const savedUser = await newUser.save();
      return resolve(
        new resultObject(200, {
          msg: "success",
          savedObject: savedUser,
        })
      );
    } catch (err) {
      console.log(err);
      return reject(new resultObject(400, "User not saved."));
    }
  });
};

/**
 * Website Login
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = (req) => {
  return new Promise((resolve, reject) => {
    const { error } = loginValidation(req.body);
    if (error) {
      return reject(new resultObject(400, error.details[0].message));
    }

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return reject(new resultObject(400, err));
      }
      if (!user) {
        return reject(new resultObject(401, "user not found"));
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            return reject(new resultObject(400, err));
          }
          if (isMatch) {
            const tokenObject = {
              _id: user._id,
              email: user.email,
              role: user.role,
            };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            return resolve(
              new resultObject(200, {
                success: true,
                token: "JWT " + token,
                user,
              })
            );
          } else {
            return reject(new resultObject(401, "Wrong password"));
          }
        });
      }
    });
  });
};

const googleAccountLogin = (profile) => {
  return new Promise((resolve, reject) => {
    User.findOne({ googleID: profile.id }).then((foundUser) => {
      if (foundUser) {
        //Google login
        console.log(`${profile.emails[0].value} User already exist`);
        return resolve(foundUser);
      } else {
        //Create google account in db
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
          .then((foundUser) => {
            if (foundUser) {
              console.log("User connected google.");
              console.log(foundUser);
              resolve(foundUser);
            } else {
              const newUser = User(newUserBody).save();
              console.log(newUser);
              resolve(newUser);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
};

console.log;

module.exports = {
  login: login,
  register: register,
  googleAccountLogin: googleAccountLogin,
};
