const router = require("express").Router();
const { UserController } = require("../controllers");

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
  UserController.register(req)
    .then((result) => {
      res.send(result.content);
    })
    .catch((err) => {
      res.status(err.statusCode).send(err.content);
    });
});

router.post("/login", (req, res) => {
  UserController.login(req)
    .then((result) => {
      res.send(result.content);
    })
    .catch((err) => {
      res.status(err.statusCode).send(err.content);
    });
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
