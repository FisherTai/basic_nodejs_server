const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { authRoute, courseRoute ,oAuthRoute} = require("./routes");
const passport = require("passport");
const cookieSession = require("cookie-session");
dotenv.config();

require("./config/passport").passport_jwt(passport);
require("./config/passport").passport_oAuth_google(passport);


mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conntect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*cookieSession for google-oAuth*/
app.use(cookieSession({
  keys:[process.env.PASSPORT_SECRET],
}));
app.use(passport.initialize());
app.use(passport.session());
/*------------------------------*/
app.use("/api/user", authRoute);
app.use("/api/user/auth", oAuthRoute);
app.use("/api/courese", passport.authenticate("jwt", { session: false }), courseRoute);

app.listen(8080, () => {
  console.log("Sever running");
});
