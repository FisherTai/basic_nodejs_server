const router = require("express").Router();
const { MessageController } = require("../controllers");
const { handleResponse } = require("../util");

router.post("/", (req, res) => {
  const { from, to, message } = req.body;
  handleResponse(MessageController.addMessage(from, to, message), res);
});
router.get("/", (req, res) => {
  const { from, to } = req.body;
  handleResponse(MessageController.getMessages(from, to), res);
});

module.exports = router;
