const router = require("express").Router();
const passport = require("passport");
const { UserController } = require("../controllers");
const { handlePromise } = require("../util");

router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

router.get("/testApi", (req, res) => {
  const msgObj = {
    message: "Test APi is working.",
    user: req.user,
    isLogin: req.isAuthenticated(),
  };
  return res.json(msgObj);
});

router.post("/register", (req, res) => {
  handlePromise(UserController.register(req), res);
});

router.post("/login", (req, res) => {
  handlePromise(UserController.login(req.body), res);
});

// TODO 登入驗證Middleware，待測試
// const authCheck = (req, res, next) => {
//   console.log(req.originalUrl);
//   req.session.returnTo = req.originalUrl;
//   if (!req.isAuthenticated()) {
//     // 尚未登入時，導向登入頁
//     res.redirect("/auth/login");
//   } else {
//     next();
//   }
// };

// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // get account info
  }),
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_DOMAIN, // passport會驗證是否成功,是的話就導向首頁
    failureRedirect: "/users/login", // 失敗則倒回登入頁面
    session: false,
  }),
);

router.post("/logout", (req, res) => {
  req.logout();
  res.send("logout success");
});

module.exports = router;
