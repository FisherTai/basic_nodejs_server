/**
 * 41 - 用戶
 * 42 - 產品
 * 43 - 訂單
 */

const ResultCode = {
  SUCCESS: 200,
  PARAM_ERROR: 400,
  UNAUTHENTICATION: 401,
  PRODUCT_EXIST: 420,
  PRODUCT_NOT_FOUND: 421,
  PRODUCT_NEED_ADMIN_PERMISSION: 422,
  UNEXPECTED_ERROR: 500,
};

const ResultCodeMessage = {
  200: "成功",
  400: "參數錯誤",
  401: "權限不足",
  420: "該產品已存在",
  421: "該產品不存在",
  422: "只有管理員能對產品進行操作",
  500: "其他錯誤",
};

module.exports.ResultCode = ResultCode;
module.exports.ResultCodeMessage = ResultCodeMessage;
