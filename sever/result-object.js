const { ResultCodeMessage } = require("./result-code");

class ResultObject {
  constructor(code, data) {
    this.code = code;
    this.message = ResultCodeMessage[code];
    this.data = data;
  }
}

module.exports = ResultObject;
