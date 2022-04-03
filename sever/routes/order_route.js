const router = require("express").Router();
const passport = require("passport");
const { OrderController, UserController } = require("../controllers");
const { ResultCode } = require("../result-code");
const { handleResponse } = require("../util");

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
    if (buyResult.code !== 200) {
      res.status(buyResult.code).send(buyResult);
    }
    const orderResult = await OrderController.createOrder(req.user._id, productId);
    if (orderResult.code !== 200) {
      res.status(orderResult.code).send(orderResult);
    }
    res.send({ code: 200, message: "success", data: [orderResult, buyResult] });
  } catch (err) {
    console.log(err);
    res.status(ResultCode.UNEXPECTED_ERROR).send(err);
  }
});

/**
 * 取得用戶清單
 */
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  handleResponse(OrderController.getOrders(req.user._id), res);
});

module.exports = router;
