---
title: apply, bind, call
date: "2019-08-03"
template: "post"
draft: false
slug: "/posts/javascript/applyCallBind"
category: "Javascript"
tags:
  - "Javscript"
  - "JS"
  - "apply"
  - "call"
  - "bind"
description: "헷갈리는 bind, call, apply 정리"
---

###apply, call 예제

<div style="background: rgba(102,153,255,0.2); width:fit-content; padding:5px 10px;text-align:left; font-weight:bold; font-size:1.3em; margin-bottom:1em;" >
function.<span class="color--red">apply</span>(thisArg, [argsArray])<br>
<br>
function.<span class="color--red">call</span>(thisArg, arg1, arg2, ...)
</div>

```js
const myName = {
  name: "Yohan"
};

function greeting(age) {
  return `Hello my name is ${
    this.name
  } i am ${age} years old. Nice to meet you.`;
}
greeting(); //이 상태에서는 Hello undefined, Nice to meet you.
greeting.call(myName, 28); //Hello my name is Yohan i am 28 years old. Nice to meet you.
greeting.apply(myName, [28]); //Hello my name is Yohan i am 28 years old. Nice to meet you.
```

<figcaption>** apply와 call은 하는 역할은 동일하며 apply는 인자로 리스트를 전달한다는 것이 차이점이다.</figcaption>

###bind 예제

<div style="background: rgba(102,153,255,0.2); width:fit-content; padding:5px 10px;text-align:left; font-weight:bold; font-size:1.3em; margin-bottom:1em;" >
function.<span <></>class="color--red">bind</span>(thisArg[, arg1[, arg2[, ...]]])
</div>

```js
let user = {
  firstName: "Yohan"
};

function func() {
  alert(this.firstName);
}

let funcUser = func.bind(user);
funcUser(); // Yohan
```

---

Javascipt로 프로젝트를 진행하다가 보면 <em class="text--red">this</em>를 사용할때 헷갈리는 부분들이 있다.<br>
특히 헷갈리는 것은 Arrow function으로 <em class="text--red">this를</em> 사용하는 경우와, <br>일반 `function()`에서 사용하는 경우일때 특히 그렇다.

지금까지는 그냥 그러려니 넘어갔지만, 그래도 js 고급단계로 넘어가기 위해서는 반드시 집고 넘어가야 했기에 이번 포스팅을 통해서 정리해보고자 한다.<br>
잘 알다시피 javacript에서 모든 것이 함수이다. 함수도 객체에 속하며, 프로토체이닝에 의하여 함수는 메소드를 상속받아 사용할 수 있다. <br>
크롬 개발자도구를 켜서 함수를 정의하면 어떤 메소드들을 사용할 수 있는지 알아보자.<br>

```js
function thisIsFunction(name, age) {
  return `My name is ${name} and I am ${age}years old`;
}
```

이러한 함수가 있다고 해보자. 이를 그대로 크롬 개발자도구에 넣고 함수를 호출해보자.<span>

<div>
    <img src="/media/images/js/jsfunc.png" width="35%" style="padding-top:1em; min-width:250px;">

</div> 
<!-- <span class="caption"></span><br> -->
	<figcaption>Function.prototype에서 사용할 수 있는 함수들</figcaption>

함수를 호출하는 방법으로는 `thisIsFunction('Yohan',28)`와 같이 일반적으로 호출하는 방법이 있고 또 다른 방법이 있다.<br>

<img src="/media/images/js/callfunc.png" width="35%">

하지만 그렇다고 해서 한 눈에 들어오지 않게 함수를 `thisIsFunction.apply(null, [])`이런 방식으로 호출하는 것은 옳지 않다.

그렇다면 이 `apply`를 언제 어떻게 사용해야 할까?
apply를 MDN web doc에서 찾아보면 이렇게 정의되어 있다.
<img src="/media/images/js/mdn-apply.png" width="30%" style="padding-top:1em; min-width:250px;">

앞에 있는 thisArg와 배열을 받게 되어 있다. this는 호출하는 상태에 따라 달라지므로 <em class="text--red">this</em>의 값은 정해져 있지 않다.

MDN web doc에 따라 apply를 사용하여 위의 함수를 사용해보았다.

```js
thisIsFunction.apply(null, ["yohan", 20]);
// "My name is yohan and I am 20years old"
```

apply를 사용할 수 있다면 bind와 call 사용법도 거의 비슷하다. apply만 필수로 <u>인자를 배열로 넘겨준다.</u>

### bind의 이해

bind는 call, apply와 동일하게 <em class="color--red">this</em>를 context에 맞게 적용해주는 역할을 하지만,<br>
다른점은 영구적으로 묶기 때문에 조심해서 접근해야 한다. 아래의 코드를 고쳐보자.<br>

```js
//https://javascript.info/bind
function askPassword(ok, fail) {
  let password = prompt("Password?", "");
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: "John",

  loginOk() {
    alert(`${this.name} logged in`);
  },

  loginFail() {
    alert(`${this.name} failed to log in`);
  }
};

askPassword(user.loginOk, user.loginFail); // undefined!
```

위 코드의 경우 언뜻 보면 잘 돌아갈 것 같지만 실제로 구동해보면 name이 <em class="color--red">undefined</em>로 뜬다.
그 이유는 askPassword에서 **Object**를 넘겨주지 않았기 때p문이다p.
따라서 마지막줄 코드를 이렇게 고쳐야 한다.

```js
askPassword(user.loginOk.bind(user), user.loginFail.bind(user));
```

이렇게 고칠 수 도 있고 ES6의 <span class="color--red">arrow function</span>을 사용하면 좀 더 쉽게 고칠 수 있다.

```js
askPassword(() => user.loginOk(), () => user.loginFail());
```

### arrow function에서의 binding

ES6에 있는 arrow function은 정의된 context에서만 호출된다.
MDN에 있는 참조문서이다.

즉 setInterval이나 setTimeOut과 같은 함수를 일반 함수에서 쓴다면 setInterval은 글로벌 Object를 가리킬 것이다.

```js
function Person() {
  // Person() 생성자는 `this`를 자신의 인스턴스로 정의.
  this.age = 0;

  setInterval(function growUp() {
    this.age++;
  }, 1000);
}

var p = new Person(); //이렇게 생성하게 되면 setInterval에서 this는 Person을 가리키지 않음.
```

하지만 arrow function을 쓰게 된다면 손쉽게 바인딩 되는 것을 확인 할 수 있다.

```js
function Person() {
  this.age = 0;

  setInterval(() => {
    this.age++; // this는 person 객체를 가리킨다.
  }, 1000);
}

var p = new Person();
```

이렇게 arrow function은 좋은 점이 많다. 그렇다고 만능은 아니다. <br>
이벤트 리스너를 사용하게 된다면 <em>this</em>는 이벤트를 발생시킨 객체를 가리키게 되는데 <br>
보통의 경우 arrow function은 이벤트리스너 안에서 context상 global을 가리키게 된다.<br>
따라서 이런 예외 사항도 있으므로 무조건 arrow function이 최신 기술이야! 하면서 고집하는 것도 옳지 않다.

### 정리

apply, call, bind를 잘 알아두어야 고급 단계로 넘어갈 수 있다고 생각한다. <br>
아직 완벽하게 이해하지는 못했다. 실제 업무상에서 많이 사용해 볼 수록 지금껏 그래왓던 것처럼 자연스럽게 체득하게 될 것이라고 생각한다.
