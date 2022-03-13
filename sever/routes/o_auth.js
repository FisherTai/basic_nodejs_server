const router = require("express").Router();
const passport = require("passport");

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // get account info
  }),
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/", // passport會驗證是否成功,是的話就導向首頁
    failureRedirect: "/users/login", // 失敗則倒回登入頁面
    session: false,
  }),
);

module.exports = router;
