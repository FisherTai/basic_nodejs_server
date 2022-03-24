const router = require("express").Router();
const { OrderController } = require("../controllers");
const { handlePromise } = require("../util");

router.use((req, res, next) => {
  console.log("A request is coming into order route");
  next();
});

router.post("/", (req, res) => {
  handlePromise(OrderController.createOrder(req.body), res);
});

module.exports = router;
