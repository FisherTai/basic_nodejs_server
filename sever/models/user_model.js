const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
    minLength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["normal", "vip"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
  },
  money: {
    type: Number,
    min: 0,
    max: 100000,
    default: 0,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.methods.isStudent = function () {
  return this.role === "normal";
};

userSchema.methods.instructor = function () {
  return this.role === "vip";
};

userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.pre("save", async function (next) {
  if (this.password && (this.isModified("password") || this.isNew)) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    next();
  }
});

userSchema.methods.comparePassword = (pw, comparePw) => new Promise((resolve, reject) => {
  bcrypt.compare(pw, comparePw, (err, isMatch) => {
    if (err) {
      reject(new Error(err));
    }
    resolve(isMatch);
  });
});

module.exports = mongoose.model("User", userSchema);
