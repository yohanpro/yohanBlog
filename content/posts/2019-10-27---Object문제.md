---
title: JS Object 이해 심화
date: "2019-10-27"
template: "post"
draft: false
slug: "/posts/js/objectQusetion"
category: "js"
tags:
  - "Object"
  - "객체"
  - "javascript"
  - "JS"
description: "Object 인터뷰 단골 질문"
---

Javascript Object는 면접 단골 질문이기도 하고 이 사람이 얼마나 JS의 기본, 깊이를 이해하고 있는지 알 수 있다.
특히 Object에는 어떤 값들이 들어갈 수 있고 어떻게 데이터가 저장되는지 이해가 필요하다.

다음과 같이 js 코드를 짠다면 log가 어떻게 나올까?

```js
const a = {};
const b = { name: "b" };
const c = { name: "c" };

a[b] = 200;
a[c] = 400;

console.log(a[b]); //400
```

출력해보면 400이 나오는 것을 확인할 수 있다. 왜 그럴까? 아니 그전에 `a`라는 빈 Object에 Object를 넣는다는 것이 생소하다.<br>

즉 a라는 Object의 프로퍼티로 배열이나 string값을 넣는것이 아니라 Object 그 자체를 넣으려고 하는 시도이다.

하지만 Javascript의 Key 또는 <u>Obejct의 Property 값은 항상 **String**만 가능하다.</u>

그렇기 때문에 a를 확인해보면 다음과 같이 로그가 찍히는 것을 확인가능하다. <br>

```js
console.log(a); // { '[object Object]': 400 }
```

그렇다. Object의 Key값으로는 String으로 밖에 들어갈 수 없기 때문에 String의 기본 형인 [object Object]로 들어간 것이다.

그래서 저 문제를 볼 때 실제로는 이렇게 진행된 것이다.

```js
const a = {};
const b = { name: "b" };
const c = { name: "c" };

a[b] = 200;
// a['[object Object]'] = 200

a[c] = 400;
// a['[object Object]'] = 400

console.log(a[b]);
// console.log(a['[object Object]']);
```

추가로 왜 [Object] 그 자체가 아니라 왜 [object Object]이냐면<br>
앞쪽의 소문자 o는 객체의 구조적 성질을 의미하고 대문자 O는 constructor를 객체라고 부르기 때문이다.

함수는 다음과 같다.<br>
`-> [object Function`<Br>
배열은 <br>
`-> [object Array]`<br>
