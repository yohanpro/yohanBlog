---
title: Express res.send() vs res.json() vs res.end() 비교
date: "2020-09-08"
template: "post"
draft: true
slug: "/posts/nodejs/express-response"
category: "react"
tags:
  - "nodejs"
  - "express"
  - "res.json"
  - "res.send"
  - "res.end"
  - "res.send"
description: express 응답방식 비교 send, json, end
---

express는 Nodejs를 쓰는 사람이라면 모두가 안다고 할 정도로 유명한 웹 프레임워크다.

express를 사용해서 response, request를 통해 주고 받고 하게 되는데 이 때 특히 response를 보내줄 때 헷갈리는 부분이 있다.

바로 `res.json()`, `res.send()`, `res.end()` 이 세가지 인데, 어떤걸 써야 하는지 가끔 헷갈릴 때가 있고 무슨 차이가 있는지 잘 알지 못하고 있어 이번 기회에 정리하고자 한다.

Express 서버가 HTTP 요청을 받게되면, res를 반환하게 된다. 보통 이렇게들 쓴다.

```js
app.get("/api/login", (req, res) => {
  // ... do something ...
});
```

이때 `res`는 NodeJs만의 업그레이드된 response object이다.

## res.send()
