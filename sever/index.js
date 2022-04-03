const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const server = require("http").createServer(app);
const ioServer = require("socket.io")(server, { cors: { orgin: "*" } });
const cors = require("cors");

const {
  authRoute,
  courseRoute,
  productRoute,
  orderRoute,
} = require("./routes");


const corsOptions = {
  origin: process.env.CLIENT_DOMAIN,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

require("./config/passport").passport_jwt(passport);
require("./config/passport").passport_oAuth_google(passport);
require("./config/passport").passport_serializeUser(passport);
require("./config/passport").passport_deserializeUser(passport);

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
app.use(cors(corsOptions));
/* cookieSession for google-oAuth */
app.use(
  cookieSession({
    keys: [process.env.PASSPORT_SECRET],
  }),
);
app.use(passport.initialize());
app.use(passport.session());
/*------------------------------*/
app.use("/api/user", authRoute);
app.use(
  "/api/courese",
  passport.authenticate("jwt", { session: false }),
  courseRoute,
);
app.use("/api/product", productRoute);
app.use("/api/order/", orderRoute);

app.listen(8080, () => {
  console.log("Sever running");
});

// socket.io
ioServer.listen(3001, () => {
  console.log("ioServer running");
});

ioServer.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("message", (data) => {
    console.log(`message:${socket.id} : ${data}`);
    socket.broadcast.emit("message", data);
  });
});
