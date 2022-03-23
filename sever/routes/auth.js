const router = require("express").Router();
const { UserController } = require("../controllers");

const handlePromise = (fn, res) => {
  fn.then(({ statusCode, content }) => {
    res.status(statusCode).send(content);
  }).catch((err) => {
    res.status(500).send(err);
  });
};

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
  handlePromise(UserController.login(req), res);
});

// 測試用
router.post("/buy", (req, res) => {
  handlePromise(UserController.buyProduct(req.body.email, req.body.productName), res);
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

// TODO 登出，待測試
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
