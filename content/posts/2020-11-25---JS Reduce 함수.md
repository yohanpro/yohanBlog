---
title: Js 프로토타입 이해
date: "2020-11-28"
template: "post"
draft: true
slug: "/posts/js/prototype"
category: "programming"
tags:
  - "Js prototype "
  - "프로토타입이란"
  - "proto"
  - "프로토 타입 체이닝"
description: 프로토타입 다시 이해하기
---

## Prototype 이해하기

함수를 생성하게 되면 2가지 일이 동시에 이루어진다.

1. 해당 함수에 constructor(생성자) 자격 부여 - new를 통해서 객체를 만들어낼수 있다.
2. prototype Object가 생성이되고 연결이 됩니다.
   **proto**는 객체가 생성될 때 조상이었던 함수의 Prototype Object를 가리킵니다.

그러니까 내가 만약에 Person이라는 function을 생성하게 되면

함수만 나오는게 아니라 Person.protoype Object 역시 생성이 된다.

new라는 키워드를 생성해서 객체를 생성하게 되면

## 함수표현식은 사용이 불가능하다.
