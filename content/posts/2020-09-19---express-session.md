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

클라이언트와 서버간 인증을 하게 될 때 이 유저가 적합한 유저인지 아닌지 파악을 해야한다.

유저가 연속적인 사용경험을 갖게 하기 위해서 유저의 인증 토큰을 클라이언트측 브라우저에 저장해놓을 필요성이 생긴다.

저장하는 공간은 크게 두 가지가 있다. 1. localstorage, 2. 쿠키

이 중에서 오늘 포스팅할 session을 통한 인증방법은 쿠키를 사용한다. 브라우저 쿠키에 암호화해놓아 저장해놓고 서버에 request를 보낼때 쿠키에 있는 정보를 가져와 서버에서 인증한다.

2. 서버에선 정보를 어디에 저장하는가
   세션을 사용하게 되면 유저 세션에 대한 정보를 서버 어딘가에 저장해놓아야 한다.
   그냥 파일형태로 가지고 있을 수도 있고 Spring 같은 프레임워크를 이용한다면 자동으로 만들어준다.

이 포스팅에서도 역시 mysql을 사용하면 session이라는 테이블이 자동으로 생성된다.

## express-mysql-session 사용하기

express npm 모듈 중에서 mysql을 쉽게 사용할 수 있는 라이브러리가 있다.

공식문서에 따른 기본 설정방법은 아래와 같다.

```js
const app = express();
```

option들

## 로그인 구현해보기

로그인 하는 과정은 아래와 같다.

1.  클라이언트에서 서버에 로그인 request을 한다.
2.  적합한 유저라면 로그인을 하고 세션을 발급한다.
3.  클라이언트에게 response를 해준다.

클라이언트가 해당 url에 접근하기만 해도 session이 이미 발급된 상황이다. 쿠키를 확인해보면 알 수 있다.
