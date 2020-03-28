---
title: [JS고급]Bind, call 사용 예제 인터뷰
date: "2020-03-28"
template: "post"
draft: true
slug: "/posts/js/bind-call-예제"
category: "JS"
tags:
  - "javascript"
  - "Bind, call"
  - "Gatsby 검색기능"
  - "인터뷰"
description: Bind와 Call 인터뷰용 질문을 알아보자.
---


Bind와 Call에 대해 블로그를 쓰긴 했지만, 더 깊이 들어가서 인터뷰용 질문에서도 확인 할수 있는 예제를 바탕으로 살펴보고자 한다. 

Bind는 이미 잘 알고 있지만, Bind 메소드는 `this`를 묶어서 사용할 수 있게끔 해준다.

MDN에 나와있는 정의이다. 

> Bind() 메소드는 호출되었을 때, 새로운 함수가 호출되었을 때, 주어진 일련의 인수를 앞에 두고 제공된 값으로  'this' 갖는 새로운 함수를 만든다.

사실 이 말만 들어서는 쉽지 않고 예제를 몇 개 풀어보는게 더 더더더더더 도움이 된다. 예제를 풀어보고 나서야 아! 이게 이 뜻이었구나를 깨닫게 된다.


```js
this.apple = 10;

const appleStore = {
  apple:20,
  getApple : function(){
    return this.apple;
  }
};

const getMyApple = appleStore.getApple();
getMyApple(); //뭐가 나올까요?

```

간단한 예제이다. 이 함수를 실행하면 나는 어떤걸 기대하냐면 appleStore에 있는 apple 20개를 가져오길 기대한다.