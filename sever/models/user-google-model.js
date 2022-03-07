const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  googleID: {
    type: String,
  },
  password: {
    type: String,
    required: false,
    minLength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
  },
  connected: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

userSchema.methods.isStudent = function () {
  return this.role === "student";
};

userSchema.methods.instructor = function () {
  return this.role === "instructor";
};

userSchema.methods.isNoidentity = function () {
  return this.role === "";
};

userSchema.methods.getConnectedId = function () {
  return this.connected;
};

module.exports = mongoose.model("GoogleUser", googleUserSchema);
