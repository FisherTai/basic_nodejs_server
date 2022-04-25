const { Messages } = require("../models");
const ResultObject = require("../result-object");
const { ResultCode } = require("../result-code");

module.exports.getMessages = async (from, to) => {
  try {
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));
    return new ResultObject(ResultCode.SUCCESS, projectedMessages);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};

module.exports.addMessage = async (from, to, message) => {
  try {
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return new ResultObject(ResultCode.SUCCESS);
    return new ResultObject(ResultCode.MESSAGE_NOT_FOUND);
  } catch (err) {
    console.log(err);
    return new ResultObject(ResultCode.UNEXPECTED_ERROR);
  }
};
