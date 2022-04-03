const ResultObject = require("./resultObject");
const ResultObject2 = require("./result-object");

const handlePromise = (fn, res) => {
  fn.then(({ statusCode, content }) => {
    console.log(`statusCode:${statusCode} content:${content}`);
    res.status(statusCode).send(content);
  }).catch((error) => {
    if (error instanceof ResultObject) {
      res.status(error.statusCode).send(error.content);
      return;
    }
    console.log(`error:${error}`);
    res.status(500).send(error);
  });
};

const handleResponse = (fn, res) => {
  fn.then((result) => {
    console.log(result);
    res.status(result.code).send(result);
  }).catch((error) => {
    console.log(error);
    if (error instanceof ResultObject2) {
      res.status(error.code).send(error);
      return;
    }
    res.status(500).send("未預期錯誤");
  });
};

module.exports.handlePromise = handlePromise;
module.exports.handleResponse = handleResponse;
