---
title: JS Advanced - 즉시실행함수
date: "2019-08-19"
template: "post"
draft: false
slug: "/posts/js/IIFE"
category: "js"
tags:
  - "js",
  - "javascript",
  - "IIFE"
  - "즉시실행함수"
description: "즉시실행함수와 사용이유 그리고 예제"
---

즉시실행함수라는 것이 있다. 보통 아래와 같이 생겼다.

```js
(function() {
  // my special code
})();
```

왜 필요할까? 언제 쓸까? 이것에 대한 해답은 하나로 정해져 있지 않다. <br>
JS를 처음 배웠을 때 이 즉시실행함수에 대해 바로 이해하기 어려웠다. JS 초급을 벗어나게 되면서 점점 JS의 고급화된 문법을 배우기 시작했고 거기에서
최근 들어서 더욱 쓸 일이 많아졌다고 생각한다.<br>

즉시실행함수는 어디에서 찾아볼 수 있을까? 다음은 hammer.js의 코드이다.
