const router = require("express").Router();
const userController = require("../controllers/user-controller");

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
  userController.register(req, res);
});

router.post("/login", (req, res) => {
  userController.login(req, res);
});


module.exports = router;
