---
title: 모바일에서 브라우저 주소창을 고려한 css height 설정방법
date: "2020-05-23"
template: "post"
draft: false
slug: "/posts/css/브라우저-주소창-크기-제어"
category: "css"
tags:
  - "브라우저 주소창 height"
  - "css"
  - "vh"
  - "브라우저 height"
  - "브라우저 resize"
  - "브라우저 주소창 반응형"
description: 브라우저 주소창 height를 고려해서 반응형 레이아웃을 잡아보자.
---

<style>
.img-50{
  width:30%;
}
</style>

반응형 개발을 하다보면 보통 Chrome 개발자 툴 같은 것을 이용하며 개발을 할 것이다.<br>
문제는 개발툴을 이용해서 만들면 잘 나오는데, 실질적으로 배포를 해보면 브라우저의 주소창 때문에 다르게 나오는 것을 알 수 있다.

<img style="width:80%;" src="https://i2.wp.com/css-tricks.com/wp-content/uploads/2018/07/viewport-units-mobile-crop.jpg?ssl=1">

<div class='caption'>&#8593;브라우저 주소창 때문에 우리가 만든 사이트가 제대로 나오지 않을 수 있다.</div>
<br>

## 해결방법

해결방법은 브라우저를 불러올때 vh로 불러온 후 `document`에 vh값에 해당하는 px값을 정해준 후 css에 설정하면 된다.<br>
뭐야 js 써야돼? css로만 할 수 있으면 좋겠는데... 할 수도 있지만 이 방법도 일단 해보면 생각보다 어렵지 않고 귀찮지도 않다.

일단 `vh`는 브라우저가 시작되고 document를 파싱할 때 자동으로 계산된다. 그리고 Javscript에는 `window.innerHeight` 변수가 있는데 이게 바로 실질적으로 브라우저에서 보이는 높이이다.

그렇기 때문에 우리는 js에 커스텀으로 `--vh`를 만들어 준 후 css에 전달하면 된다.

```css
.my-element {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
```

css를 위와 같이 만들어 주고 js는 아래와 같이 사용하면 된다.

```js
let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty("--vh", `${vh}px`);
```

위의 코드는 height 100을 적용하기 위해 0.01에 해당하는 값을 저장하고 js의 `:root`에 css 변수 `--vh`를 만들어주는 것이다.

## 브라우저 크기를 늘리거나 줄인다면?

위의 코드는 잘 작동하지만 사용자가 브라우저의 크기를 늘리거나 줄이면 다시 vh 값을 변화시켜야 한다.
`window`에 `resize`이벤트 리스너를 붙이고 리사이징할때 변화시켜 주면 된다.

```js
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("resize", () => {
  console.log("resize");
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
```

[참고 사이트 : https://css-tricks.com/the-trick-to-viewport-units-on-mobile](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
