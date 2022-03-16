const router = require("express").Router();
const { ProductController } = require("../controllers");

router.use((req, res, next) => {
  console.log("A request is coming into product route");
  next();
});

/**
 * 獲取產品清單
 */
router.get("/", (req, res) => {
  ProductController.getProducts()
    .then(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    })
    .catch(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    });
});

/**
 * 依產品ID獲取產品
 */
router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  ProductController.getProduct(_id)
    .then(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    })
    .catch(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    });
});

router.post("/", (req, res) => {
  ProductController.createProduct(req.body, (req.user && req.user.isAdmin()))
    .then(({ statusCode, content }) => {
      console.log(`S:${(statusCode, content)}`);
      res.status(statusCode).send(content);
    })
    .catch((error) => {
      // TODO 錯誤未處理
      console.log(`createProduct:${error}`);
      res.status(error.statusCode).send(error.content);
    });
});

router.patch("/:_id", (req, res) => {
  const { _id } = req.params;
  ProductController.editProduct(_id, req.body, (req.user && req.user.isAdmin()))
    .then(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    })
    .catch(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    });
});

router.delete("/:_id", (req, res) => {
  const { _id } = req.params;
  ProductController.deleteProduct(_id, (req.user && req.user.isHighest()))
    .then(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    })
    .catch(({ statusCode, content }) => {
      res.status(statusCode).send(content);
    });
});

module.exports = router;
