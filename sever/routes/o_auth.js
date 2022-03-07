const router = require("express").Router();
const passport = require("passport");

//Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], //get account info
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    console.log("google redirect...");
    res.redirect("/"); //redirect page
  }
);
