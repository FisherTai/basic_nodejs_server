# Basic Web Server

使用Express+MongoDB，附帶會員系統與購物功能的Web Server

[toc]

---

### 環境變數

* 在根目錄創建一個.env檔
<img src='https://i.imgur.com/jQFdrb2.gif'/>
* 參數:

```js
DB_CONNECT=<用來連結mongodb的key>
PASSPORT_SECRET=<passport所使用的key>
GOOGLE_CLIENT_ID=<google OAuthID>
GOOGLE_CLIENT_SECRET=<google OAuth憑證>
CLIENT_DOMAIN=<client端網域>
SERVER_DOMAIN=<server端網域>
```

---

### 開始

1.安裝套件

```
npm install
```

2.啟動

```
nodemon index.js
```

---

### 功能

#### User

* 用戶註冊
* 用戶登入
* Google OAuth 2.0 登入
* 用戶登出
* Json Web Token 驗證
* 用戶權限管理

#### Product

* 產品列表
* 會員儲值金
* 產品購買

#### Order
用戶的購買紀錄

---

### 流程

<img src='https://github.com/FisherTai/basic_user_module/blob/master/arc/account_process.png'/>

### Data Schema

#### 用戶Schema


<table>  
  <tr>
    <th>field</th>
    <th>type</th>
    <th>describe</th>
  </tr>
  <tr>
    <td>username</td>
    <td>String</td>
    <td>用戶名</td>
  </tr>
  <tr>
    <td>email</td>
    <td>String</td>
    <td>Email</td>
  </tr>
   <tr>
    <td>googleID</td>
    <td>String</td>
    <td>oAuth登入產生的ID</td>
  </tr>
   <tr>
    <td>password</td>
    <td>String</td>
    <td>用戶密碼，存入時會做雜湊</td>
  </tr>
   <tr>
    <td>role</td>
    <td>String</td>
    <td>normal | vip</td>
  </tr>
   <tr>
    <td>date</td>
    <td>Date</td>
    <td>創建日期</td>
  </tr>
  <tr>
    <td>thumbnail</td>
    <td>String</td>
    <td>頭像</td>
  </tr>
  <tr>
    <td>money</td>
    <td>Number</td>
    <td>儲值金</td>
  </tr>
  <tr>
    <td>products</td>
    <td>Array</td>
    <td>產品清單</td>
  </tr>
</table>

---

#### 產品Schema

<table>  
  <tr>
    <th>field</th>
    <th>type</th>
    <th>describe</th>
  </tr>
  <tr>
    <td>product_name</td>
    <td>String</td>
    <td>產品名</td>
  </tr>
  <tr>
    <td>product_price</td>
    <td>Number</td>
    <td>產品價格</td>
  </tr>
   <tr>
    <td>product_des</td>
    <td>String</td>
    <td>產品描述</td>
  </tr>
   <tr>
    <td>product_category</td>
    <td>String</td>
    <td>money|gift</td>
  </tr>
   <tr>
    <td>product_pic</td>
    <td>String</td>
    <td>產品圖片(url)</td>
  </tr>
   <tr>
    <td>product_shelves</td>
    <td>Boolean</td>
    <td>上架狀態</td>
  </tr>
</table>


---
### API 

#### Login API

**POST**
**/api/user/login**

<table>
  <tr>
    <th>parm</th>
    <th>type</th>
    <th>describe</th>
  </tr>
  <tr>
    <td>email</td>
    <td>String</td>
    <td></td>
  </tr>
  <tr>
    <td>password</td>
    <td>String</td>
    <td></td>
  </tr>
</table>

```JSON
{
  "email": "kow2@emali.com",
  "password": "a12345"
}
```

**Response**

```JSON
{
    "success": true,
    "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIwN2M3ZDVjZDlhNjZhZmUxMDQwMzEiLCJlbWFpbCI6ImtvdzJAZW1hbGkuY29tIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE2NDY5MzA4MTl9.DvKO8I-RIiDXvE3JxXCdqheis89d_CX3Ed6-l-M3Tnc",
    "user": {
        "_id": "62207c7d5cd9a66afe104031",
        "username": "kow2",
        "email": "kow2@emali.com",
        "password": "$2b$10$eJtvSvhp7S8R.73xdVBLE.36SeZuagFlaWMpEnKxlTecDcSPpERVS",
        "role": "instructor",
        "date": "2022-03-03T08:29:49.103Z",
        "__v": 0
    }
}
```

---

#### Register API

**POST**
**/api/user/register**

<table>
  <tr>
    <th>parm</th>
    <th>type</th>
    <th>describe</th>
  </tr>
  <tr>
    <td>username</td>
    <td>String</td>
    <td></td>
  </tr>
  <tr>
    <td>email</td>
    <td>String</td>
    <td></td>
  </tr>
    <tr>
    <td>password</td>
    <td>String</td>
    <td></td>
  </tr>
    <tr>
    <td>role</td>
    <td>String</td>
    <td>student or instructor</td>
  </tr>
</table>

```
{
  username: "kow2",
  email: "kow2@emali.com",
  password: "a12345",
  role: "instructor",
}
```

**Response**

```
{
    "msg": "success",
    "savedObject": {
        "username": "kow3",
        "email": "kow3@emali.com",
        "password": "$2b$10$73srSNXUys61CS3UlFAg/esm.kGe9U2QyvZzbkMfhGlfinutjLsK6",
        "role": "instructor",
        "_id": "622a2e239bfb3a92f60572e3",
        "date": "2022-03-10T16:58:11.445Z",
        "__v": 0
    }
}
```

#### Google oAuth Login

**/api/user/auth/google**
