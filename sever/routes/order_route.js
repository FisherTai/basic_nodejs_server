const router = require("express").Router();
const { OrderController } = require("../controllers");

router.use((req, res, next) => {
  console.log("A request is coming into order route");
  next();
});

router.post("/", (req, res) => {
  OrderController.createOrder(req.body)
    .then(({ statusCode, content }) => {
      console.log(`S:${(statusCode, content)}`);
      res.status(statusCode).send(content);
    })
    .catch((error) => {
      // TODO 錯誤未處理
      console.log(`createOrder:${error}`);
      res.status(error.statusCode).send(error.content);
    });
});
