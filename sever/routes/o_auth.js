const router = require("express").Router();
const passport = require("passport");

//Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], //get account info
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  (req, res) => {
    console.log("google redirect...");
    res.redirect("/"); //redirect page
  }
);

module.exports = router;
