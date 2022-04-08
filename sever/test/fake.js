// /api/user/login
const loginTestPost = {
  email: "unifisher07@gmail.com",
  password: "a12345",
};
// /api/user/register
const registerTestPost = {
  username: "",
  email: "",
  password: "a12345",
};
// /api/courese/
const coureseTestPost = {
  title: "How to make apple juice3",
  description: "How to make apple juiceaaa",
  price: "300",
};

const ProductCreateTest = {
  product_name: "測試1",
  product_price: 50,
  product_des: "測試貼圖",
  product_category: "gift",
  product_shelves: true,
};

module.exports = {
  loginTestPost,
  registerTestPost,
  coureseTestPost,
  ProductCreateTest,
};
