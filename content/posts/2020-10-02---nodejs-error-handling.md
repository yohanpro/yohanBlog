---
title: (NodeJS) Express 에러 핸들링하기
date: "2020-10-10"
template: "post"
draft: true
slug: "/posts/nodejs/error-handling"
category: "typescript"
tags:
  - "error handling"
  - "nodejs에서 에러 핸들링하기"
  - "nodejs"
  - "Express"
description: Express에서 에러 핸들링 하는 방법을 알아보자.
---

nodejs 에러 핸들링 하는 방법이 궁금하다.

에러가 발생할 경우 어떻게 공통로직으로 처리를 해주어야 하는가?

에러가 발생하는 경우는 보통

1. 서버에서 오류가 생겼다. (500)
2. 클라이언트에서 잘못된 api를 요청(400)
3. 서버 -> DB에서 작업하는 과정에서 오류 (500)

내가 알고 싶은것
서버에서 오류가 생겼을때 이를 프론트 에 보여주는 공통된 로직 만들기

프론트 단에서 에러가 생겼을 경우?

## Error handling 미들웨어 선언하기

기본적으로 express에서 오류를 처리하는 공통 미들웨어를 작성할 때 다음과 같이 해주어야 한다.

```js
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

인자 3개를 선언하게 되면 일반적인 미들웨어이고 error 미들웨어는 인자 4개를 선언해야 한다.

express-generator로 만들어보면 이렇게 만들어져 있다.

```js
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
```

주의해야 할 점은 express-generator로 만들었을 경우 저 에러 핸들링하는 코드를 맨 아래로 내려야 한다는 것이다.<br>

## async await 사용하기

Express는 ES6가 나오기 이전에 거의 다 만들어졌기 때문에 비동기 에러를 처리하는데 잘 작동하지 않는다.<br>
Promise reject시 에러 처리 미들웨어에서 사용이 되지 않는 것을 볼 수 있다.

```js
app.get("*", function (req, res) {
  return new Promise((resolve, reject) => {
    setImmediate(() => reject(new Error("에러 발생")));
  });
});

app.use(function (error, req, res, next) {
  console.log("호출 되지 않음!");
  res.json({ message: error.message });
});
```

```bash
(node:6852) UnhandledPromiseRejectionWarning: Error: 에러 발생
    at Immediate.<anonymous> (/Users/gim-yohan/Desktop/Projects/nodejs/mysessionApp/app.js:34:20)
    at processImmediate (internal/timers.js:456:21)
(node:6852) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)

```

<br>

#### 헬퍼 함수 사용하여 비동기 오류 처리하기

```js
function wrapAsync(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 next()로 전달하기
    fn(req, res, next).catch(next);
  };
}
```

```js
app.get(
  "*",
  wrapAsync(async function (req, res) {
    await new Promise((resolve) => setTimeout(() => resolve(), 50));
    // 비동기 에러
    throw new Error("에러 발생!");
  })
);

app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.listen(3000);

function wrapAsync(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 체인의 next() 미들웨어에 전달하세요
    // (이 경우에는 오류 처리기)
    fn(req, res, next).catch(next);
  };
}
```

정말 기가 막힌 해결방법이다!

각각 라우터에서 독립적으로 해결하지 않고 모든 오류를 하나의 함수로 만들어서 처리하게 된다면 코드가 깔끔해 질 것이다.<br>
DB에서 오류가 발생하거나 한다면 각각 라우터에서 error 캐칭을 안해도 된다. 이걸 보고 무릎을 탁치며 얼마 전 끝난 프로젝트를 떠올렸다.<br>

```js
const connection = require("../db/dbconnect");

// CREATE
const doInsertQuery = (query, data = []) => {
  return new Promise((resolve, reject) => {
    connection.execute(query, data, (err, results, fields) => {
      if (err) reject(err);
      resolve(results.insertId); // 입력된 데이터 idx;
    });
  });
};

// READ
const doSelectQuery = (query, data = []) => {
  return new Promise((resolve, reject) => {
    connection.execute(query, data, (err, results, fields) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};
```

얼마 전 프로젝트에서 사용했던 방법이다.<br>
DB에서 오류가 발생할 경우 방도가 없어 `if(err)`이 공통으로 들어가게끔 처리하곤 했는데 그럴 필요가 없는 것이다.

이 방법을 미리 알았더라면 좋았을 것이다. 이래서 사람은 공부를 해야 한다.s
