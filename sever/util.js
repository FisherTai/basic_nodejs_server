const ResultObject = require("./result-object");

const handleResponse = (fn, res) => {
  fn.then((result) => {
    console.log(result);
    res.status(result.code).send(result);
  }).catch((error) => {
    console.log(error);
    if (error instanceof ResultObject) {
      res.status(error.code).send(error);
      return;
    }
    res.status(500).send("未預期錯誤");
  });
};

module.exports.handleResponse = handleResponse;
