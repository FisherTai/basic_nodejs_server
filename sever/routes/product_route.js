const router = require("express").Router();
const { ProductController } = require("../controllers");
const { handleResponse } = require("../util");

router.use((req, res, next) => {
  console.log(`A request product route :${req.url}`);
  next();
});

/**
 * 獲取產品清單
 */
router.get("/", (req, res) => {
  handleResponse(ProductController.getProducts(), res);
});

/**
 * 依產品ID獲取產品
 */
router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  handleResponse(ProductController.getProduct(_id), res);
});

router.post("/", (req, res) => {
  handleResponse(
    ProductController.createProduct(req.body, req.user && req.user.isAdmin()),
    res,
  );
});

router.patch("/:_id", (req, res) => {
  const { _id } = req.params;
  handleResponse(
    ProductController.editProduct(
      _id,
      req.body,
      req.user && req.user.isAdmin(),
    ),
    res,
  );
});

router.delete("/:_id", (req, res) => {
  const { _id } = req.params;
  handleResponse(
    ProductController.deleteProduct(_id, req.user && req.user.isHighest()),
    res,
  );
});

module.exports = router;
