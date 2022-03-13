// /* eslint-disable no-underscore-dangle */
// const { expect } = require("chai");
// const supertest = require("supertest");
// const mock = require("./mock");

// require("../index");

// const api = supertest("http://localhost:8080/api/user/testApi"); // 定義測試的 API 路徑
// let APItoken; // 全域變數等待 before() 取得 Token

// // before() 測試開始前會先跑完裡面內容
// before((done) => {
//   api
//     .post("/user/login") // 登入測試
//     .set("Accept", "application/json")
//     .send(mock.loginTestPost)
//     .expect(200)
//     .end((err, res) => {
//       APItoken = res.body.token; // 登入成功取得 JWT
//       done();
//     });
// });

// // describe() 描述區塊測試內容，可視為一個測試的群組，裡面可以跑很多條測試。
// describe("Course", () => {
//   // it() 可撰寫每條測試內容
//   it("Course should be an object with keys and values", (done) => {
//     api
//       .get("/api/courese/") // 測試取得所有文章
//       .expect(200)
//       .end((err, res) => {
//         if (err) done(err);
//         // 斷言做資料驗證
//         expect(res.body[0]).to.have.property("_id");
//         expect(res.body[0]._id).to.be.a("string");
//         expect(res.body[0]).to.have.property("title");
//         expect(res.body[0].title).to.be.a("string");
//         expect(res.body[0]).to.have.property("price");
//         expect(res.body[0].price).to.be.a("number");
//         expect(res.body[0]).to.have.property("description");
//         expect(res.body[0].description).to.be.a("string");
//         expect(res.body[0]).to.have.property("instructor");
//         expect(res.body[0].instructor).to.be.a("object");
//         done();
//       });
//   });

//   it("should return a 200 response", (done) => {
//     api
//       .get("/api/courese") // 測試取得所有課程
//       .set("Authorization", `Bearer ${APItoken}`) // 將 Bearer Token 放入 Header 中的 Authorization
//       .expect(200, done);
//   });
// });

// after();
