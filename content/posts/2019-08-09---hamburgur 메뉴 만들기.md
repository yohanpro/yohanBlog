---
title: css,scss로 내비게이션 슬라이드(햄버거 메뉴) 만들기
date: "2019-08-09"
template: "post"
draft: false
slug: "/posts/css/hamburgerMenu"
category: "css"
tags:
  - "hamburgerMenu"
  - "햄버거 메뉴"
  - "::after"
  - "::before"
  - "슬라이드 내비게이션 메뉴"
description: "scss로 내비게이션 슬라이드(햄버거 메뉴) 만들기"
---

<br>
<video autoplay loop style="display:block; width:35%;  height:auto;">
  <!-- Specify video sources -->
  <source src="/media/videos/hamburger.mov" type="video/webm">

</video>

웹사이트에 가면 위와 같은 메뉴를 볼 수 있을 것이다. 저 클립은 내가 실제로 만든 웹사이트인데,<br>
예전에 한번 만들어둔 햄버거 메뉴를 모듈화 시켜놓아 비슷한 사이트에서 잘 써먹고 있다. 만드는 방법은 여러가지 방법이 있겠지만, 내가 사용하는 방법을 공유해보고 싶었다. <br>

## Step 1. 기본 뼈대 만들기

기본으로 div에 hamburger-icon을 만들어준 후 위치를 잡아준다. <br>
메뉴아이콘의 위치는 만들고자 하는 웹사이트에 따라 달라진다. 여기서는 설명하기 위함이므로 가운데에 맞춰놓았다.

```html
<div class="hamburger-icon"></div>
```

div로 hamburger-icon을 만들어 준 후 크기, 위치를 잡아준다.
사실 50px 정도면 꽤 큰 편이다. 적당히 만들어 준다.

```css
.hamburger-icon {
  width: 50px;
  height: 30px;
  position: fixed;
  z-index: 4;
  left: 50%; //위치를 보기좋게 만들기 위함.
  top: 30%; //위치를 보기좋게 만들기 위함.
  cursor: pointer;
}
```

이제 위, 가운데, 아래쪽에 선을 하나씩 만들어 줄 차례이다. <br>
물론 직접 이렇게 만들어 줄 수도 있다.

```html
<div class="hamburger-icon">
  <div class="hamburger-icon__top"></div>
  <div class="hamburger-icon__middle"></div>
  <div class="hamburger-icon__bottom"></div>
</div>
```

하지만 이렇게 만들면 굳이 필요없는 클래스까지 붙여가며 만들어야 한다, 그리고 뽀대가 나지 않지 않은가?<br>
그래서 나는 가운데 middle만 사용하고 나머지는 <span class="color--red">가상 선택자(pseudo class)</span>로 만들기로 하였다.

https://codepen.io/yohanpro/pen/pMxdgW/

이제 세 개의 선을 긋는데는 성공했다. <br>
이제 Javascript를 이용하여 클릭할 시에 X로 변하도록 만들어 주면 된다.<br>

## Step 2. Javascript 붙이기

이제 내가 필요한 사항을 정리한다. 어떻게 만들 것인가? <br>
그냥 **script.js**를 만들고 그 안에다가 죽 쓰면 되는 것일까? <br>

```js
document.querySelector(".hambuger-icon").addEventListener("click", function() {
  //~~~~ 이런식으로?
});
```

뭐 그렇게 사용해도 좋지만, 나는 이 햄버거 메뉴아이콘을 React를 사용한 다른 웹사이트 등에서도 사용하고 싶기 때문에 <span class="color--red">모듈화</span>를 하고 싶었다.

### 만들기 전 정리

- 재사용성을 위해 class기반으로 만든다.
- jquery를 사용하지 않는다. 역시 재사용성과 관련이 있다.
- 이벤트를 붙이는 메소드, 인스턴스 초기화, 기타 메소드를 나눈다. <em>(코드의 간결성, 중복을 제거하기 위해)</em>

#### 1단계. Class를 선언하고 생성자에 변수를 선언해준다.

```js
class HamburgerMenu {
  constructor() {
    this.hamburgerIcon = document.querySelector(".hamburger-icon");
  }
}
```

#### 2단계. toggle 될 시 발생할 이벤트인 toggleTheMenu를 정의해준다.

```js
class HamburgerMenu {
  constructor() {
    this.hamburgerIcon = document.querySelector(".hamburger-icon");
  }
  toggleTheMenu() {
    this.hamburgerIcon.classList.toggle("hamburger-icon--close");
  }
}
```

#### 3단계. toggleTheMenu를 events함수에 넣어주고 이벤트를 붙여준다. 생성자에서 events 함수를 실행시킨다.

```js
class HamburgerMenu {
  constructor() {
    this.hamburgerIcon = document.querySelector(".hamburger-icon");
    this.events();
  }
  events() {
    this.hamburgerIcon.addEventListener("click", () => this.toggleTheMenu());
  }
  toggleTheMenu() {
    this.hamburgerIcon.classList.toggle("hamburger-icon--close");
  }
}
```

주의해야할 점은 addEventListener를 붙여주는 과정에서 위처럼 es6의 화살표를 쓰지 않을 경우 오류가 날 수 있다.<br>
그 이유는 이벤트 객체의 특성상 <span class="color--red">this</span>가 global 객체를 가리키기 때문인데,
해결방법은 위처럼 arrow function을 사용하거나, 아래처럼 bind함수로 묶어주어야 한다.

```js
this.hamburgerIcon.addEventListener("click", this.toggleTheMenu.bind(this));
```

#### 4단계. Click시 발생할 이벤트 css 추가

자바스크립트를 다 만들었다면 이제 class가 add 될 시 일어날 css를 추가해주면 된다.<br>
가운데에 있는 middle은 필요 없으므로 opacity를 0으로 만들어주고, <br><span class="color--red">::before</span>과 <span class="color--red">::after</span>는 transform을 사용하여 돌려주면 된다.<br> 재밌는 건 똑같이 transform값을 주면 정확하게 X가 만들어져야 할 것 같은데, 미세하게 다르다. 대략 1px정도.. <br><s style="font-size:0.7em;">정확한 이유는 모르겠다.</s> 보기에 약간 차이가 있다면 translate값을 조정해주자.

```scss
.hamburger-icon {
  &--close {
    &::before {
      transform: rotate(45deg) scaleX(1.5) translateY(0px);
      width: 30px;
      background: #fff;
    }

    .hamburger-icon__middle {
      // .hamburger-icon에 close 클래스가 있을때는 0으로 만들어줌
      opacity: 0;
      transform: scaleX(0);
      background: #fff;
    }

    &::after {
      transform: rotate(-45deg) scaleX(1.5) translateY(1px); //왜 차이가 나는 것일까?
      background: #fff;
      width: 30px;
    }
  }
}
```

마지막으로 transition을 사용하여 애니메이션 효과를 주게되면 완성된다.

```scss
.hamburger-icon {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgb(246, 152, 48);
    transform-origin: 0 0;
    transition: transform 0.3s ease-out;
  }

  &__middle {
    position: absolute;
    top: 13px;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgb(246, 152, 48);
    transition: all 0.3s ease-out;
    transform-origin: 0 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgb(246, 152, 48);
    transform-origin: 0 100%;
    transition: transform 0.3s ease-out;
  }
}
```

짜잔 완성되었다!!

https://codepen.io/yohanpro/pen/mNzVYG
