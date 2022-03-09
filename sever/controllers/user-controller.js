const router = require("express").Router();
const { registerValidation, loginValidation } = require("../validation");
const { User , GoogleUser } = require("../models/");


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
      reject(new resultObject(400, error.details[0].message));
    }

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      reject(new resultObject(400, "Email has already been regestered"));
    }

    const googleUserExist = await GoogleUser.findOne({ email: req.body.email });
    if (googleUserExist) {
      reject(
        new resultObject(
          400,
          "already been regestered,please try to login using google account"
        )
      );
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
      resolve(
        new resultObject(200, {
          msg: "success",
          savedObject: savedUser,
        })
      );
    } catch (err) {
      console.log(err);
      reject(new resultObject(400, "User not saved."));
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
      reject(new resultObject(400, error.details[0].message));
    }

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        reject(new resultObject(400, err));
      }
      if (!user) {
        reject(new resultObject(401, "user not found"));
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            reject(new resultObject(400, err));
          }
          if (isMatch) {
            const tokenObject = {
              _id: user._id,
              email: user.email,
              role: user.role,
            };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            resolve(
              new resultObject(200, {
                success: true,
                token: "JWT " + token,
                user,
              })
            );
          } else {
            reject(new resultObject(401, "Wrong password"));
          }
        });
      }
    });
  });
};

const googleAccountLogin = (profile) => {
  return new Promise((resolve, reject) => {
    GoogleUser.findOne({ googleID: profile.id }).then((foundGoogleUser) => {
      if (foundGoogleUser) {
        //Google login
        console.log(`${profile.emails[0].value} User already exist`);
        resolve(foundGoogleUser);
      } else {
        //Create google account in db
        const newGoogleUser = new GoogleUser({
          username: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        User.findOne({ email: profile.emails[0].value }).then((foundUser) => {
          if (foundUser) {
            //Connect DB User
            console.log(`Connect Account: ${foundUser.email}`);
            newGoogleUser.connected = foundUser._id;
          }
          newGoogleUser.save().then(() => {
            console.log("New user create.");
            resolve(newGoogleUser);
          });
        });
      }
    });
  });
};

console.log

module.exports = {
  login: login,
  register: register,
  googleAccountLogin:googleAccountLogin,
};
