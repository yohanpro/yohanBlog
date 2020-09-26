---
title: Express mysql session 사용해보기
date: "2020-09-19"
template: "post"
draft: true
slug: "/posts/nodejs/express-session"
category: "nodejs"
tags:
  - "nodejs"
  - "express"
  - "express-session-mysql"
  - "express-session"

description: express mysql session 사용해보기
---

## session이란

session이라는 단어는 사실 여러군데에서 사용 되기 때문에 여기 글에서는 정확하게는 **'서버측 웹 세션'**을 의미한다.
웹 세션은 사용자가 애플리케이션(즉 웹이나 서버)와 상호 작용하는 동안에만 사용할 수 있도록 임시 데이터를 저장하기 위해 사용하는 데이터 형태이다.

DB까지 가지않아도 유저의 데이터를 저장할 수 있다는 점 역시 큰 장점이다. user의 이름 같은 정보를 세션에 저장해놓는다면 굳이 DB에 쿼리를 던지지 않아도 된다.
이는 더욱 빠른 응답을 가능하게 한다.

그리고 이 유저가 연속적인 사용경험을 갖게 하기 위해서 유저의 인증 토큰을 클라이언트측 브라우저에 저장해놓을 필요성이 생긴다.

이 토큰을 저장하는 공간은 크게 두 가지가 있다.

<ul style="font-size:1.2rem; line-height:1.3;">
  <li>Localstorage</li>
  <li>쿠키</li>
</ul>

이 중에서 오늘 포스팅할 session을 통한 인증방법은 쿠키를 사용한다. 브라우저 쿠키에 암호화해놓아 저장해놓고 서버에 request를 보낼때 쿠키에 있는 정보를 가져와 서버에서 인증한다.

둘 중 뭐가 더 안전하냐 말한다면 사실 둘 다 다른사람이 내 컴퓨터나 기기를 사용하게 된다면 둘 다 안전하지 않다. 탈취해서 악용할 수도 있기 때문에 이를 막기 위해 refresh토큰을 사용하거나, expiredate를 설정해주어야 한다.

## 서버에선 정보를 어디에 저장하는가

세션을 사용하게 되면 유저 세션에 대한 정보를 서버 어딘가에 저장해놓아야 한다.
그냥 파일형태로 가지고 있을 수도 있고 Spring 같은 프레임워크를 이용한다면 자동으로 만들어준다.

이 포스팅에서도 역시 mysql을 사용하면 session이라는 테이블이 자동으로 생성된다.

## express-mysql-session 사용하기

express npm 모듈 중에서 mysql을 쉽게 사용할 수 있는 라이브러리가 있다.

공식문서에 따른 기본 설정방법은 아래와 같다.

```js
var express = require("express");
var app = (module.exports = express());
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var options = {
  host: "localhost",
  port: 3306,
  user: "session_test",
  password: "password",
  database: "session_test",
};

var sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
```

보이는 그대로 읽어보면, `app.use`를 사용해 글로벌 미들웨어를 선언하고 있다. 이 글로벌 미들웨어는 session을 사용하는 것을 의미하며, 저장소는 mysql로 저장한다고 되어있다.

`app.use()`를 다른 미들웨어를 사용하기 전에 미리 선언해두어야 별 지장없이 사용할 수 있을것이다. 이로써 어떤 유저든 우리서버가 만든 웹사이트에 접근한다면 session을 생성하게 된다.

## 기본 로그인 구현해보기

기본 express-generator로 기본 템플릿을 만들었다.

```bash
express --view=hbs mysessionApp
```

그리고 여기에 필요한 모듈들을 설치해준다.

```bash
npm i mysql express-session express-mysql-session
```

그리고 위에서 말한 것처럼 기본 sql 설정을 해준다.<br>
당연히 로컬에서 mysql을 사용하고 있어야 한다. 이 설정에 대해서는 굳이 설명을 하지 않겠다.

```js
const mysql = require("mysql");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "session_test",
};

var sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

var connection = mysql.createConnection(options); // or mysql.createPool(options);
var sessionStore = new MySQLStore({} /* session store options */, connection);
```

그리고 auth.js 라우팅을 설정해준다.

```js
// auth.js

router.post("/login", function (req, res, next) {
  const { id, password } = req.body;
  console.log(req.body);
  console.log("password", password);

  if (id == "test" && password === "1234") {
    req.session.authenticate = true;
    res.status(200).send({ code: 1, msg: "its authenticated" });
  } else {
    res.status(200).send({ code: 2, msg: "다시 한번 확인해주세요" });
  }
});
module.exports = router;
```

기본 `views` 폴더아래에 login.hbs를 만들어준다.

```html
// login.hbs
<div>
  <h2>This is login page</h2>

  <form style="display: flex; flex-direction: column">
    <label>아이디: <input type="text" id="id" /></label>
    <label>패스워드: <input type="password" id="password" /></label>
  </form>
  <button onclick="login()">로그인</button>
</div>

<script>
  function login(params) {
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          console.log(xhr.responseText);
        } else {
          console.error(xhr.responseText);
        }
      }
    };
    xhr.open("POST", "http://localhost:3000/auth/login");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({ id: id.value, password: password.value }));
  }
</script>
```

매우 간단한 포맷으로 기능이 우선이기에 스타일은 신경쓰지 않았다.
