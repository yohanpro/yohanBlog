---
title: (JS고급)Bind 이해와 인터뷰용 질문
date: "2020-03-29"
template: "post"
draft: false
slug: "/posts/js/bind-예제"
category: "JS"
tags:
  - "javascript"
  - "Bind"
  - "addEventListener"
  - "인터뷰"
description: Bind 이해와 인터뷰용 질문을 알아보자.
---

# 다시 한번 Bind!
Bind와 Call에 대해 블로그를 쓰긴 했지만, 더 깊이 들어가서 인터뷰용 질문에서도 확인 할수 있는 예제를 바탕으로 살펴보고자 한다. 
Bind는 이미 잘 알고 있지만, Bind 메소드는 `this`를 묶어서 사용할 수 있게끔 해준다.
MDN에 나와있는 정의이다. 

<blockquote>
  <strong>bind() 메소드</strong>가 호출되면 새로운 함수를 생성합니다. 받게되는 첫 인자의 value로는 <strong>this 키워드</strong>를 설정하고, 이어지는 인자들은 바인드된 함수의 인수에 제공됩니다.
   <span><em><small><s>이해하기가 어렵다</s></small></em></span>
</blockquote> 

사실 이 말만 들어서는 쉽지 않고 예제를 몇 개 풀어보는게 더 더더더더더 도움이 된다. 예제를 풀어보고 나서야 아! 이게 이 뜻이었구나를 깨닫게 된다.


```js
this.apple = 10;

const appleStore = {
  apple:20,
  getApple : function(){
    return this.apple;
  }
};

const getMyApple = appleStore.getApple;
getMyApple(); //10

```

간단한 예제이다. 이 함수를 실행하면 나는 어떤걸 기대하냐면 appleStore에 있는 apple 20개를 가져오길 기대한다.
하지만 신기하게도 <strong>appleStore에</strong> 있는 <strong>getApple</strong> 함수를 호출했음에도 global scope에 선언되어 있는 **10**이 콘솔에 찍힌다. 왜 그럴까?


이 함수를 실행하게 되면 **this**는 더 이상 appleStore를 가리키는게 아니라 <strong>global Object</strong>를 가리킨다.

이걸 제대로 실행되도록 고치려면 아래와 같이 **Bind 함수를 호출**해주어야 한다.
```js
this.apple = 10;

const appleStore = {
    apple: 20,
    getApple: function(){
        return this.apple;
    }
};

const getMyApple = appleStore.getApple.bind(appleStore); //Bind로 묶어주기;
const result = getMyApple();

console.log(result); //20

```

이제 위에서 설명했던 MDN의 설명 중에서 "**받게되는 첫 인자의 value로는 this 키워드를 설정하고** "부분이 이해가 된다.<br>
그렇다면 나머지 설명, <strong>"이어지는 인자들은 Bind된 함수의 인수에 제공됩니다."</strong>를 알아보자.

```js
this.apple = 10;

const appleStore = {
    apple: 20,
    getApple: function(unit,args){
        return this.apple+unit+args;
    }
};

const getMyApple = appleStore.getApple.bind(appleStore,'개'); //Bind로 묶어주기;
const result = getMyApple(' 입니다'); // 두번째 인자로 들어가게 되는 셈이다

console.log(result); //20개 입니다

```
위와 같이 두 번째 인자에 unit을 넣어주었다. 즉 <strong>this</strong> 뒤에 들어가는 인자는 Bind된 함수의 인수로 제공된다.
여기까지가 MDN에서 설명한 Bind이다.

# addEventListner에서 Bind

사실 처음 Javascript를 해보는 사람들 예를 들어 퍼블리셔나, 새내기 Front-end 개발자가 Bind를 찾게 되는 가장 큰 이유는 아마 **addEventListener**에서 일 것이다. 아래와 같이 말이다.

```js

const buttonAction = {
   //생략
    goToHome: function() {
    this.goToSlide(this.home, this.presentation);
  }
}

document.getElmentById('button').addEventListener('click', this.goToHome.bind(this));

```


아니 젠장 도대체 Bind가 뭔데? 라고 생각을 하며 괴로워할 수도 있을 것이다.
그러니까 위에서 배운 걸 적용해서 보면  `document.getElmentById('button')`에서 더 이상 **this**는 buttonAction을 가리키지 않는다.
위에서 처럼 Bind 해주어야 한다. 아래도 마찬가지이다.

```js
class MobileMenu {
  constructor() {
    this.menuIcon = $(".icon-hamburger-menu");
    this.events();
  }

  events() {
    this.menuIcon.click(this.toggleTheMenu.bind(this)); //이 bind안에 있는 this는 MobileMenu를 가리킨다.
  }

  toggleTheMenu() {
    this.menuIcon.toggleClass("icon-hamburger-menu--close-x");
    this.slideMenu.toggleClass("slidemenu--expanded");
  }
}
```

events내 <strong>this.menuIcon.click</strong>의 **this**는 menuIcon을 가리킨다. 그렇기 때문에 <strong>this.toggleTheMenu</strong>에서도 <strong>this를</strong> <strong>MobileMenu로</strong> 가리키도록 변경해주어햐 하는 것이다.

# 인터뷰용 JS Bind 문제

아래 문제에서 두 개의 `console.log()`에서는 어떻게 나올것인가? 
아래 답을 보지 말고 풀어보자.
```js

const account1 = {
  name: 'Yohan',
  totalAmount: 5000,
  deductAmount: function(amount) {
    this.totalAmount -= amount;
    return 'Amount in account: ' + this.totalAmount;
  },
};
 
const account2 = {
  name: 'John',
  totalAmount: 8000,
};
 
const withdrawFromAccount = function(amount) {
  return account1.deductAmount.bind(account2, amount);
};
 
console.log(withdrawFromAccount(500)());
console.log(withdrawFromAccount(200)());

```

이미 예전에 내가 다룬 적이 있는데 `(500)()` 패턴이 당황스러울 수도 있을 것이다. 하지만 함수의 return을 알면 어렵지 않게 풀 수 있다.

`withdrawFromAccount` 함수에서 account2는 **this**로 키워드가 될 것이다. 그리고 위에서 말한 것과 같이 <strong>account1 'Yohan'</strong>의 totalAmount는 이 예제에서 전혀 사용하지 않게 된다. (**this**가 **account2**를 가리키므로 )
<br>
<br>
<br>
<br>
<br>
정답:  7500, 7300