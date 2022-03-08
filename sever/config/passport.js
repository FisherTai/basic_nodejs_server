const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { User } = require("../models");
const { GoogleUser } = require("../models");

module.exports.passport_jwt = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    //此處的jwt_payload為jwt.sign()傳入的物件
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log("JwtStrategy cb");
      User.findOne({ _id: jwt_payload._id }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
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
      //檢查用戶profile是否已存在在資料庫
      function (accessToken, refreshToken, profile, cb) {
        console.log("GoogleStrategy...");
        // console.log(profile);
        GoogleUser.findOne({ googleID: profile.id }).then((foundGoogleUser) => {
          if (foundGoogleUser) {
            //Google login 
            console.log(`${profile.emails[0].value} User already exist`);
            cb(null, foundGoogleUser);
          } else {
            //Create google account in db
            const newGoogleUser = new GoogleUser({
              username: profile.displayName,
              googleID: profile.id,
              thumbnail: profile.photos[0].value,
              email: profile.emails[0].value,
            });
            //TODO 關聯用戶，未完成
            User.findOne({ email: profile.emails[0].value }).then(
              (foundUser) => {
                if (foundUser) {
                  console.log(`Connect Account: ${foundUser.email}`);
                  newGoogleUser.connected = foundUser._id;
                }
                newGoogleUser.save().then(() => {
                  console.log("New user create.");
                  cb(null, newGoogleUser);
                });
              }
            );
          }
        });
      }
    )
  );
};
