const handlePromise = (fn, res) => {
  fn.then(({ statusCode, content }) => {
    console.log(`statusCode:${statusCode} content:${content}`);
    res.status(statusCode).send(content);
  }).catch((error) => {
    console.log(error);
    res.status(500).send(error);
  });
};

module.exports.handlePromise = handlePromise;
