const ResultObject = require("./resultObject");

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

module.exports.handlePromise = handlePromise;
