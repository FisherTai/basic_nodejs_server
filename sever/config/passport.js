/* eslint-disable no-underscore-dangle */
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const passport = require("passport");
const { UserController } = require("../controllers");
const { User } = require("../models");

// OAuth登入時將user data放入session
module.exports.passport_serializeUser = (passport) => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user.");
    done(null, user._id);
  });
};

module.exports.passport_deserializeUser = (passport) => {
  passport.deserializeUser((_id, done) => {
    console.log("Deserializing user.");
    User.findById({ _id }).then((user) => {
      // console.log(`Found user.:${user}`);
      done(null, user);
    });
  });
};

module.exports.passport_jwt = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    // 此處的jwt_payload為jwt.sign()傳入的物件
    new JwtStrategy(opts, (jwtPayload, done) => {
      console.log("JwtStrategy cb");
      User.findOne({ _id: jwtPayload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
        // or you could create a new account
      });
    }),
  );
};

module.exports.passport_oAuth_google = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/user/auth/google/redirect",
      },
      // 檢查用戶profile是否已存在在資料庫
      async (accessToken, refreshToken, profile, cb) => {
        console.log("GoogleStrategy...");
        // console.log(profile);
        const user = await UserController.googleAccountLogin(profile);
        cb(null, user);
      },
    ),
  );
};
