/**
 * 41 - 用戶
 * 42 - 產品
 * 43 - 訂單
 */

const ResultCode = {
  SUCCESS: 200,
  PARAM_ERROR: 400,
  UNAUTHENTICATION: 401,
  USER_NOT_LOGIN: 402,
  NEED_ADMIN_PERMISSION: 403,
  USER_EMAIL_EXIST: 410,
  USER_NOT_FOUND: 411,
  USER_TRY_GOOGLE: 412,
  USER_WRONG_PASSWORD: 413,
  USER_MONEY_ENOUGH: 414,
  PRODUCT_EXIST: 420,
  PRODUCT_NOT_FOUND: 421,
  ORDER_NOT_FOUND: 431,
  ORDER_DATA_ERROR: 432,
  UNEXPECTED_ERROR: 500,
};

const ResultCodeMessage = {
  200: "成功",
  400: "參數錯誤",
  401: "權限不足",
  402: "用戶未登入",
  403: "只有管理員能進行此操作",
  410: "用戶Email已註冊",
  411: "用戶不存在",
  412: "請嘗試使用Google帳號登入",
  413: "密碼錯誤",
  414: "儲值金不足",
  420: "該產品已存在",
  421: "該產品不存在",
  431: "該訂單不存在",
  432: "訂單產品或會員不存在",
  500: "未預期的錯誤",
};

module.exports.ResultCode = ResultCode;
module.exports.ResultCodeMessage = ResultCodeMessage;
