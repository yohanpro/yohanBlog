---
title: Javascript Array reduce 함수로 빈도를 계산해보자.
date: "2020-11-24"
template: "post"
draft: false
slug: "/posts/js/array-reduce"
category: "programming"
tags:
  - "Array.prototype.reduce"
  - "Redcue 함수 사용해보기"
  - "Reduce함수로 빈도 계산해보기"
description: Reduce 함수 실전 사용기
---

Reduce 함수는 array를 다룰때 잘 알아두면 좋은 함수이다.
MDN Web doc을 살펴보자.

> `reduce()` 메서드는 배열의 각 요소에 대해 주어진 리듀서(reducer) 함수를 실행하고,
> 하나의 결과값을 반환합니다.

Reduce 함수는 4개의 인자를 가진다.

- 누산기accumulator (acc)
- 현재 값 (cur)
- 현재 인덱스 (idx)
- 원본 배열 (src)

여기서 가장 많이 쓰는 것은 현재까지 누적된 값을 가지고 있는 누산기 acc, 그리고 현재값이다.
그리고 **initialValue**가 있는데 초기 값을 주지 않으면 배열의 첫번째 요소를 사용하게 된다.
가장 큰 매력은 최종 return 값이 array나 Object, string이 될 수도 있다는 것이다.

```js
arr.reduce((acc, cur, idx, src) => {}, initialValue);
```

예제에선 죄다 덧셈을 예로 들어 설명하고 있는데 초기값을 잘 활용하면 `map, filter`역시 구현할 수 있다. 이걸 잘 알아두면 아래와 같은 문제를 해결할 수 있다.

<hr>

#### 문제 : 배열이 주어졌을 때 가장 많이 사용된 값을 리턴하라

예를 들어 배열이 [500, 200, 300, 400, 500, 600, 400, 500]로 주어졌을 때 500이 가장 많이 나오므로 500을 리턴하면 된다.

reduce를 사용하면 아래와 같이 만들 수 있다.

```js
let arr = [500, 200, 300, 400, 500, 600, 400, 500, 600, 600, 600];

let result = arr.reduce((acc, cur) => {
  /**
   * 1. acc안에 해당 cur이 있는지 확인한다.
   * 2. acc안에 해당 cur이 없다
   *  -> acc에 object를 하나 만들고 거기에 cur을 키값으로 해서 하나 넣고 0을 해준다.
   *
   * 3. acc안에 해당 cur이 있다
   *  -> acc 해당 키값에 count +1을 해준다.
   */

  if (!acc[cur]) {
    acc[cur] = 0;
  }
  acc[cur] += 1;
  return acc;
}, {});

console.log(result); // { '200': 1, '300': 1, '400': 2, '500': 3, '600': 4 }
```

<br>

## map, filter, flatten 구현하기

reduce로 많은 것들을 구현할 수 있다. map, filter, flatten 뿐만 아니라 다양하게 활용할 수 있으므로<br/> js 개발자라면 익숙해지도록 하는 것이 좋다.

#### map: 배열 전체에 2를 곱하여 리턴하기

```js
const arr = [1, 2, 3];

let result = arr.reduce((acc, cur) => {
  acc.push(cur * 2);
  return acc;
}, []);

console.log(result); //[2,4,6]
```

<Br>

#### filter: 배열에서 짝수 찾기

```js
const arr = [7, 2, 8, 23, 67, 50];

let result = arr.reduce((acc, cur) => {
  if (cur % 2 === 0) acc.push(cur);
  return acc;
}, []);

console.log(result); //[2,8,50]

//하지만 그래도 가독성은 filter가 좋다.
let result = arr.filter((el) => el % 2 === 0);
```

<Br>

#### flatten : 배열 납작하게 만들기

```js
const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

let result = arr.reduce((acc, cur) => {
  return acc.concat(cur);
}, []);

// es6의 spread operator로 이렇게 만들 수도 있다.
let ran = [];
let newArr = arr.forEach((el) => ran.push(...el));
```
