const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userController = require("../controllers/user-controller");
const { User } = require("../models");

const passport = require("passport");

//OAuth登入時將user data放入session
passport.serializeUser((user,done) => {
  console.log("Serializing user.");
  done(null,user._id);
});

//將session內的user data取出放入req.user
passport.deserializeUser((_id,done) => {
  console.log("Deserializing user.");
  User.findById({_id}).then(user => {
    console.log("Found user.");
    done(null,user);
  })
})

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
      async function (accessToken, refreshToken, profile, cb) {
        console.log("GoogleStrategy...");
        // console.log(profile);
        const user = await userController.googleAccountLogin(profile);
        cb(null, user);
      }
    )
  );
};
