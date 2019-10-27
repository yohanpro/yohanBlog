---
title: 배열에서 indexOf 사용해보기
date: "2019-10-04"
template: "post"
draft: false
slug: "/posts/js/arrayIndexof"
category: "js"
tags:
  - "array"
  - "js"
  - "javascript"
  - "arrayIndexof"
description: "배열에서 indexOf 사용해보기"
---

`Array.prototype.indexOf`는 배열에서 원하는 값을 찾고자 할 때 사용된다. <br>그리고 많이 쓰이므로 잘 알아두면 참 여러모로 좋은 메소드이다.

`indexof`를 사용하는 방법은 간단하고 직관적이다.<br>
찾고자 하는 값이 있으면 해당 array의 index 값을 return 하고 없으면 -1을 return 한다.<br>
그리고 만약 찾는 값이 여러개가 있다고 한다면 가장 앞의 값의 index를 반환해준다.

```js
const namesArr = ["John", "Smith", "Frank"];
let result1 = namesArr.indexOf("Smith");
let result2 = namesArr.indexOf("Harry");

console.log(result1); // 1
console.log(result2); // -1
```

## 값에 의한 참조 , 주소에 의한 참조

여기서 중요한 점은 Javscript에서 두 개의 다른 Obect는 절대 같지 않다는 것이다.<small>(설령 아예 같은 값을 가지고 있더라도)</small><br>
하지만 만약 두 개의 Object가 동일한 참조값을 가지고 있다면 같다고 인식한다.

다음 예제를 보면 알 수 있다.

```js
const arr1 = [{ name: "John" }, { name: "Smith" }];
let result = arr1.indexOf({ name: "Smith" });
console.log(result); // -1
```

위에서 보면 알 수 있듯이 같은 값을 가지고 indexOf 함수를 실행했음에도 불구하고 result는 -1로 찾지 못했다고 나온다.<br>

그 이유는 똑같은 값을 가지고 있는 Object라고 하더라도 원시타입이 아닌 값<em>(String, Number, Boolean, null, undefined)</em>이라면 다른 주소값을 가지고 있기 때문에 서로 다르다고 인식하기 때문이다.

```js
const obj = { name: "John" };
const obj2 = { name: "John" };
console.log(obj === obj2); //false;
```

따라서 마찬가지로 다른 값이기 때문에 indexOf도 -1을 return 한다.

그래서 위와 같이 arr내 원시타입이 아닌 값을 indexOf로 찾고 싶다면 아래와 같이 변경을 해주어야 한다.

```js
const arr1 = [{ name: "John" }, { name: "Smith" }];
const name = { name: "Smith" };
let result = arr1.findIndex(el => el.name === "Smith");
console.log(result);
```
