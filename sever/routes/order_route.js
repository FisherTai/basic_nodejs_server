const router = require("express").Router();
const passport = require("passport");
const { OrderController, UserController } = require("../controllers");
const { handlePromise } = require("../util");

router.use((req, res, next) => {
  console.log("A request is coming into order route");
  next();
});

/**
 * 購買產品
 */
router.post("/:productId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { productId } = req.params;
  try {
    const buyResult = await UserController.buyProduct(req.user._id, productId);
    if (buyResult.statusCode !== 200) {
      res.status(400).send(buyResult);
    }
    const orderResult = await OrderController.createOrder(req.user._id, productId);
    if (orderResult.statusCode !== 200) {
      res.status(400).send(orderResult);
    }
    res.send({ message: "success", result: [orderResult, buyResult] });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**
 * 取得用戶清單
 */
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  handlePromise(OrderController.getOrders(req.user._id), res);
});

module.exports = router;
