---
title: Express 미들웨어 기본
date: "2020-05-10"
template: "post"
draft: false
slug: "/posts/express-middleware"
category: "Node.JS"
tags:
  - "express"
  - "미들웨어"
  - "Cannot set headers after"
  - "express next"
  - "Express"
  - "NodeJS"
description: express의 미들웨어에 대해 놓치고 있는 것들
---

express의 미들웨어의 개념을 잘 모르면 나중에 더 헷갈릴 수 있다.
미들웨어에 대해서 어느정도 알고 있다고 생각하는 사람들도 이 블로그를 보면 다시 보면 얻어가는 것이 있으리라 생각하고 포스팅한다.

## 미들웨어의 기본 개념

아래 코드는 간단하게 만든 express 실행 코드이다.

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/users", (req, res) => {
  res.send("Users Page");
});

app.listen(3000);
```

미들웨어는 req 요청 처리를 하고 응답(res)을 하는 과정 중간에서 발생하는 모든 이벤트들을 처리하는 것이라고 볼 수 있다.

## 미들웨어 만들기

여기서 간단하게 logger 미들웨어를 아래와 같이 만들 수 있다.

```js
const express = require("express");
const app = express();
...

function logger(req, res, next) {
  console.log("Log");
  next();
}
app.listen(3000);
```

물론 이렇게도 쓸 수 있지만 이 경우에는 users에는 더 이상 미들웨어를 쓰지 않을때 사용한다.<br>
즉 아래와 같이 사용하는 건 실무에서는 없을 것이다.

```js
app.get("/users", (req, res, next) => {
  res.send("Users Page"); //이 경우에는 users에 미들웨어를 더 쓸 수 없다.
  next();
});
```

사용하는 방법은 크게 보면 두 가지가 있다.
첫째 아래와 같이 `use`를 사용하여 global로 사용하는 것이다.
이렇게 하면 `/`이나 `/users`로 get 요청을 보내면 Log가 찍히는 것을 볼 수 있다.

### 글로벌로 미들웨어 사용하기

```js
const express = require("express");
const app = express();

app.use(logger); //global로 사용
```

조심해야 할 것은 글로벌로 선언한 위치에 따라 달라진다.
만약 아래와 같이 작성한다면 Logger가 안 찍힌다.

```js
app.get("/", (req, res) => {
  console.log("Home Page");
  res.send("Home Page");
});

...

app.use(logger); //이 로거는 찍히지 않음

function logger(req, res, next) {
  console.log("Log");
  next();
}

```

그 이유는 `next`를 호출하지 않았기 때문이다. 이렇게 하면 먼저 'Home page'가 찍히고 그 다음 'Log'가 찍힌다.

```js
app.get("/", (req, res, next) => {
  console.log("Home Page");
  res.send("Home Page");
  next(); //next 처리를 해주어야 글로벌 미들웨어인 logger가 찍힘
});
...

app.use(logger); //Homepage 다음에 찍힘

function logger(req, res, next) {
  console.log("Log");
  next();
}

```

<br>

## 미들웨어를 인자로 넣어 사용하기

보통 미들웨어라고 하면 이런 형식으로 많이 사용한다. users get 요청을 할 때 인증을 받은 사용자만 접근할 수 있도록 하려고 한다.
그렇다면 이렇게 두 번째 인자에 auth 함수를 넣어 사용하면 된다.

```js
app.get("/users", auth, (req, res) => {
  console.log("Users Page");
  res.send("Users Page");

});
...
function auth(req, res, next) {
  console.log("Auth");
  next();
}
```

<br>

## Cannot set headers after they are sent to the client 에러

```
$ Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    at ServerResponse.setHeader (_http_outgoing.js:526:11)
```

이런 에러는 미들웨어를 쓸 때 많이들 실수하는 것 중 하나이다. <br>이 이유가 발생하는 이유는 완벽하게 `next()`를 호출해 끝이 났는데도 `res.send()`를 호출할 때 생긴다.

아래를 보자.

```js
app.get("/users", auth, (req, res) => {
  console.log("User Page");
  res.send("Users Page"); //이미 res.send()를 호출했다.
});

function auth(req, res, next) {
  if (req.query.admin === "true") {
    next(); //next를 호출해 다음으로 넘어가야 한다.
  }
  res.send("No auth"); // 보낸 다음 다시 res.send()를 호출한다.
}
```

즉 미들웨어에서 이를 해결하려면 next()를 호출한 후 `return` 으로 함수를 빠져나가야 한다.

```js
function auth(req, res, next) {
  if (req.query.admin === "true") {
    next();
    return; //함수를 끝내기
  }
  res.send("No auth"); // 보낸 다음 다시 res.send()를 호출한다.
}
```

아니면 else를 써서 접근하지 못하게 막아야 한다. 미들웨어를 쓸 경우 이런 에러가 나지 않도록 조심하자.
