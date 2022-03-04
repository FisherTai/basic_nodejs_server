const router = require("express").Router();
const { registerValidation, loginValidation } = require("../validation");
const { User, Course } = require("../models/");
const jwt = require("jsonwebtoken");

const passport = require("passport");

router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

router.get("/testApi", (req, res) => {
  const msgObj = {
    message: "Test APi is working.",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email has already been regestered");
  }

  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObject: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("User not saved.");
  }
});

router.post("/login", (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("user not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          return res.status(400).send(err);
        }
        if (isMatch) {
          const tokenObject = {
            _id: user._id,
            email: user.email,
            role: user.role,
          };

          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET); //TODO 因環境抓不到.env檔
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password");
        }
      });
    }
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"], //get account info
  })
);

router.get(
  "auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/")//redirect page
  }
);

module.exports = router;
