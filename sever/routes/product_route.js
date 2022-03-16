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
    ProductController.createProduct(req.body)
      .then(({ statusCode, content }) => {
          console.log(`S:${ statusCode, content }`);
        res.status(statusCode).send(content);
      })
      .catch(({ statusCode, content }) => {
          //TODO 錯誤未處理
        console.log(`F:${ statusCode, content }`);
        res.status(statusCode).send(content);
      });
  });

  router.patch("/:_id", (req, res) => {
    const { _id } = req.params;
    ProductController.editProduct(_id)
      .then(({ statusCode, content }) => {
        res.status(statusCode).send(content);
      })
      .catch(({ statusCode, content }) => {
        res.status(statusCode).send(content);
      });
  });

  router.delete("/", (req, res) => {
    const { _id } = req.params;
    ProductController.editProduct(_id)
      .then(({ statusCode, content }) => {
        res.status(statusCode).send(content);
      })
      .catch(({ statusCode, content }) => {
        res.status(statusCode).send(content);
      });
  });

  module.exports = router;
