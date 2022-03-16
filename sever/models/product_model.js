const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_des: {
    type: String,
    required: true,
  },
  product_category: {
    type: String,
    enum: ["money", "gift"],
  },
  product_pic: {
    type: String,
  },
  product_shelves: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
