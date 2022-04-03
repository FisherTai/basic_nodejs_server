/* eslint-disable no-underscore-dangle */
const { expect } = require("chai");
const supertest = require("supertest");
const dotenv = require("dotenv");
const fake = require("./fake");
// require("../index");
dotenv.config();

const api = supertest(process.env.SERVER_DOMAIN); // 定義測試的 API 路徑
let APItoken; // 全域變數等待 before() 取得 Token
let ProductTestId;

// before() 測試開始前會先跑完裡面內容
// eslint-disable-next-line prefer-arrow-callback
before(function (done) {
  this.timeout(10000);
  api
    .post("/api/user/login") // 登入測試
    .set("Accept", "application/json")
    .send(fake.loginTestPost)
    .expect(200)
    .end((err, res) => {
      APItoken = res.body.token; // 登入成功取得 JWT
      console.log(`Test token:${APItoken}`);
      done();
    });
});

// describe() 描述區塊測試內容，可視為一個測試的群組，裡面可以跑很多條測試。
describe("Course", () => {
  // it() 可撰寫每條測試內容
  // it("Course should be an object with keys and values", (done) => {
  //   api
  //     .get("/api/courese/") // 測試取得所有文章
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) done(err);
  //       // 斷言做資料驗證
  //       expect(res.body[0]).to.have.property("_id");
  //       expect(res.body[0]._id).to.be.a("string");
  //       expect(res.body[0]).to.have.property("title");
  //       expect(res.body[0].title).to.be.a("string");
  //       expect(res.body[0]).to.have.property("price");
  //       expect(res.body[0].price).to.be.a("number");
  //       expect(res.body[0]).to.have.property("description");
  //       expect(res.body[0].description).to.be.a("string");
  //       expect(res.body[0]).to.have.property("instructor");
  //       expect(res.body[0].instructor).to.be.a("object");
  //       done();
  //     });
  // });

  it("should return a 200 response", (done) => {
    api
      .get("/api/courese") // 測試取得所有課程
      .set("Authorization", `${APItoken}`) // 將 Bearer Token 放入 Header 中的 Authorization
      .expect(200, done);
  });
});

// describe("user", () => {});

describe("product", () => {
  it("test get product list", (done) => {
    api
      .get("/api/product") // 測試取得所有課程
      .set("Authorization", `${APItoken}`) // 將 Bearer Token 放入 Header 中的 Authorization
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res.body).to.have.property("code");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });

  it("test create product", (done) => {
    api
      .post("/api/product")
      .set("Authorization", `${APItoken}`)
      .send(fake.ProductCreateTest)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res.body).to.have.property("code");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        ProductTestId = res.body.data._id;
        done();
      });
  });

  it("test get product", (done) => {
    api
      .get(`/api/product/${ProductTestId}`)
      .set("Authorization", `${APItoken}`)
      .send(fake.ProductCreateTest)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res.body).to.have.property("code");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });

  it("test edit product", (done) => {
    api
      .patch(`/api/product/${ProductTestId}`)
      .set("Authorization", `${APItoken}`)
      .send(fake.ProductCreateTest)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res.body).to.have.property("code");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });

  it("test delete product", (done) => {
    api
      .delete(`/api/product/${ProductTestId}`)
      .set("Authorization", `${APItoken}`)
      .send(fake.ProductCreateTest)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        console.log(res.body);
        expect(res.body).to.have.property("code");
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });
});

describe("order", () => {});
