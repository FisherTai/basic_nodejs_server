const router = require("express").Router();
const { ProductController } = require("../controllers");

const handlePromise = (fn, res) => {
  fn.then(({ statusCode, content }) => {
    console.log(`S:${(statusCode, content)}`);
    res.status(statusCode).send(content);
  }).catch((error) => {
    res.status(500).send(error);
  });
};

router.use((req, res, next) => {
  console.log("A request is coming into product route");
  next();
});

/**
 * 獲取產品清單
 */
router.get("/", (req, res) => {
  handlePromise(ProductController.getProducts(), res);
});

/**
 * 依產品ID獲取產品
 */
router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  handlePromise(ProductController.getProduct(_id), res);
});

router.post("/", (req, res) => {
  handlePromise(
    ProductController.createProduct(req.body, req.user && req.user.isAdmin()),
    res
  );
});

router.patch("/:_id", (req, res) => {
  const { _id } = req.params;
  handlePromise(
    ProductController.editProduct(
      _id,
      req.body,
      req.user && req.user.isAdmin()
    ),
    res
  );
});

router.delete("/:_id", (req, res) => {
  const { _id } = req.params;
  handlePromise(
    ProductController.deleteProduct(_id, req.user && req.user.isHighest()),
    res
  );
});

module.exports = router;
