---
title: Express res.send() vs res.json() vs res.end() 비교
date: "2020-09-08"
template: "post"
draft: false
slug: "/posts/nodejs/express-response"
category: "nodejs"
tags:
  - "nodejs"
  - "express"
  - "res.json"
  - "res.send"
  - "res.end"
description: express 응답방식 비교 send, json, end
---



express는 Nodejs를 쓰는 사람이라면 모두가 안다고 할 정도로 유명한 웹 프레임워크다.

express를 사용해서 response, request를 통해 주고 받고 하게 되는데 이 때 특히 response를 보내줄 때 헷갈리는 부분이 있다.

이 부분에 대해 구글 엔지니어인 타마스 피로스의 [블로그 글](https://tpiros.dev/blog/res-json-vs-res-send-vs-res-end-in-express/)을 보고 참고하였다.

바로 `res.json()`, `res.send()`, `res.end()` 이 세가지 인데, 어떤걸 써야 하는지 가끔 헷갈릴 때가 있고 무슨 차이가 있는지 잘 알지 못하고 있어 이번 기회에 정리하고자 한다.

Express 서버가 HTTP 요청을 받게되면, res를 반환하게 된다. 보통 이렇게들 쓴다.

```js
app.get("/api/login", (req, res) => {
  // ... do something ...
});
```

이때 `res`는 NodeJs만의 업그레이드된 response object이다.

## 바쁜 사람들 위해 짧게 설명해보면...

<Br>

<p style="font-size:1.5rem; font-weight:bold; text-align:center;">사실 res.send()와 res.json()은 별반 다를바 없다.</p>

> - `res.send()`는 send에 전해진 argument에 따라서 Content-type이 자동적으로 만들어진다. 이게 기본이다.<br>
> - `res.json()`은 json이 아닌 것도 json 형식으로 바꾸어서 보내준다. 즉 content-type 헤더를 **application/JSON**으로 고정한다. 그런데 결국 res.json()도 마지막에 res.send()를 호출한다.<br>
> - `res.end()`는 보내줄 아무 데이터도 없는데 response를 끝내고 싶을 때 사용한다.<br> ex) res.status(400).end();

  <br>

## res.send()

이름에서부터 알 수 있듯 `res.send()`는 기본적으로 response를 보내는 역할을 한다. 그리고 이게 기본이라고 생각하면 된다.

기본적으로 서버에서 response 처리를 할 때 **Content-Type**을 지정해주어야 한다.

res.send는 우리가 어떤 데이터를 보내는지 파악을 해서 이에 알맞게 Contnet-Type을 지정해준다. 이는 Buffer,String, Object, Array 일 수 있다.

예를 들어서 Buffer 데이터를 반환해준다면 res.send는 자동으로 Content-Type을 `application/octet-stream`으로 지정한다.

## res.json()

웹개발자들이 데이터를 주고 받을때 보통 RESTful API의 형태로 데이터를 주고 받는다(요즘은 다른 방식도 많이 등장했지만). <br>그러면 보통 이때 사용하는 형식은 JSON일 확률이 거의 대부분일 것이다. 그럼 아래와 같이 서버 응답을 보내줄 것이다.

```js
app.get("/api/login", (req, res) => {
  res.send({ name: "John" });
});
```

res.json은 자주 쓰이는 메소드를 구현해놓은 것이라고 보면 된다. 즉 안에 들어있는 데이터들을 자동을 json 형식으로 바꾸어 보내준다.

이 경우 header의 모습은 다음과 같을 것이다.

```curl
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 17
ETag: W/"11-IkjuL6CqqtmReFMfkkvwC0sKj04"
Date: Fri, 10 Aug 2018 09:34:13 GMT
Connection: keep-alive

```

즉 결론적으로 말하면 res.send()와 res.json()은 별반 다를게 없다.

## res.end()

사실 이 메소드는 안써도 된다. 문서를 읽어보면 보내줄 데이터가 없을 때 사용한다고 되어있는데, 주로 예를 드는게 404를 리턴해주어야 할 때이다.
그리고 res.json()을 쓰나 res.send()를 쓰나 응답을 종료해주는 역할은 하기 때문에 굳이 명시적으로 표시해줄 필요는 없다.
