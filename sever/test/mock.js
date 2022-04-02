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
  role: "normal",
};
// /api/courese/
const coureseTestPost = {
  title: "How to make apple juice3",
  description: "How to make apple juiceaaa",
  price: "300",
};

module.exports = {
  loginTestPost,
  registerTestPost,
  coureseTestPost,
};
