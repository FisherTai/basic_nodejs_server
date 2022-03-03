const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { authRoute, courseRoute } = require("./routes");
const passport = require("passport");
require("./config/passport")(passport);

dotenv.config();

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
app.use("/api/user", authRoute);
app.use("/api/courese", passport.authenticate("jwt", { session: false }), courseRoute);

app.listen(8080, () => {
  console.log("Sever running");
});
