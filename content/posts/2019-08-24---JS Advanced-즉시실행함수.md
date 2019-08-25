---
title: JS Advanced - 즉시실행함수
date: "2019-08-24"
template: "post"
draft: false
slug: "/posts/js/IIFE"
category: "js"
tags:
  - "js"
  - "javascript"
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

## 실제 코드예시

즉시실행함수는 어디에서 찾아볼 수 있을까? 다음은 jquery.hammer.js의 코드이다.

<div class="colorscripter-code" style="color:#F1F2F3;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; position:relative !important;overflow:auto"><table class="colorscripter-code-table" style="margin:0;padding:0;border:none;background-color:#22282A;border-radius:4px;" cellspacing="0" cellpadding="0"><tr><td style="padding:6px;border-right:2px solid #4f4f4f"><div style="margin:0;padding:0;word-break:normal;text-align:right;color:#aaa;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;line-height:130%"><div style="line-height:130%">1</div><div style="line-height:130%">2</div><div style="line-height:130%">3</div><div style="line-height:130%">4</div><div style="line-height:130%">5</div><div style="line-height:130%">6</div><div style="line-height:130%">7</div><div style="line-height:130%">8</div><div style="line-height:130%">9</div><div style="line-height:130%">10</div><div style="line-height:130%">11</div><div style="line-height:130%">12</div><div style="line-height:130%">13</div><div style="line-height:130%">14</div><div style="line-height:130%">15</div><div style="line-height:130%">16</div></div></td><td style="padding:6px 0;text-align:left"><div style="margin:0;padding:0;color:#F1F2F3;font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;line-height:130%"><div style="padding:0 6px; white-space:pre; line-height:130%">(<span style="color:#93C763">function</span>(factory)&nbsp;{</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#93C763">if</span>&nbsp;(<span style="color:#93C763">typeof</span>&nbsp;define&nbsp;<span style="color:#A082BD"></span><span style="color:#93C763">=</span><span style="color:#A082BD"></span><span style="color:#93C763">=</span><span style="color:#A082BD"></span><span style="color:#93C763">=</span>&nbsp;<span style="color:#EC7600">'function'</span>&nbsp;<span style="color:#A082BD"></span><span style="color:#93C763">&amp;</span><span style="color:#A082BD"></span><span style="color:#93C763">&amp;</span>&nbsp;define.amd)&nbsp;{</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;define([<span style="color:#EC7600">'jquery'</span>,&nbsp;<span style="color:#EC7600">'hammerjs'</span>],&nbsp;factory);</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;</div><div style="padding:0 6px; white-space:pre; line-height:130%"><span style="color:#919191">/*....생략&nbsp;*/</span></div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#919191">//&nbsp;extend&nbsp;the&nbsp;emit&nbsp;method&nbsp;to&nbsp;also&nbsp;trigger&nbsp;jQuery&nbsp;events</span></div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;Hammer.Manager.<span style="color:#93C763">prototype</span>.emit&nbsp;<span style="color:#A082BD"></span><span style="color:#93C763">=</span>&nbsp;(<span style="color:#93C763">function</span>(originalEmit)&nbsp;{</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#93C763">return</span>&nbsp;<span style="color:#93C763">function</span>(type,&nbsp;data)&nbsp;{</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;originalEmit.call(this,&nbsp;type,&nbsp;data);</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$(this.element).trigger({</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;type,</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gesture:&nbsp;data</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;};</div><div style="padding:0 6px; white-space:pre; line-height:130%">&nbsp;&nbsp;&nbsp;&nbsp;})(Hammer.Manager.<span style="color:#93C763">prototype</span>.emit);</div><div style="padding:0 6px; white-space:pre; line-height:130%">}));</div></div><div style="text-align:right;margin-top:-13px;margin-right:5px;font-size:9px;font-style:italic"><a href="http://colorscripter.com/info#e" target="_blank" style="color:#4f4f4ftext-decoration:none">Colored by Color Scripter</a></div></td><td style="vertical-align:bottom;padding:0 2px 4px 0"><a href="http://colorscripter.com/info#e" target="_blank" style="text-decoration:none;color:white"><span style="font-size:9px;word-break:normal;background-color:#4f4f4f;color:white;border-radius:10px;padding:1px">cs</span></a></td></tr></table></div>

### 기본 사용방법

일반적으로 anonymous함수(익명 함수)를 실행 할 때는 참조변수를 할당 한 후에 ()를 붙여서 실행한다.<br>
이게 보통 우리가 사용하는 방식이다.

```js
const a = function() {};
a();
```

IIFE는 이렇게 사용한다.

```js
(function(){...})()
//이렇게도 사용할 수 있다.
(function(){...}())

```

하지만 보통 첫번째 방법을 많이 사용하는 것 같다.<br>
ES6의 row function을 사용한다면 이렇게 나타낸다.

```js
(() => {
  /* */
})();
```

### 사용하는 이유

왜 사용할까? 전문적으로 말하면 전역변수에 접근하지 못하게 하기 위함이다.<br>
아래와 같이 더 쉽게 설명해보고자 한다.

```js
const myFunc = function() {
  const content = "Hello World";
  console.log(content);
};
```

이제 myFunc는 해당 Script나 해당 script를 참조하는 html의 어떤 곳에서든 접근할 수 있다. <br>
하지만 코드가 길어지고 규모가 방대해 진다면 이름이 동일한 함수나 변수를 사용해야 할 일이 생길 지도 모른다.(가능한 한 피하는 편이 좋지만)<br>
특히나 외부 라이브러리를 이용한다면 내가 사용하는 이 변수이름이 외부 라이브러리의 이름과 동일한 일이 생길 수도 있지 않은가?<br>

기본적으로 함수표현은 함수를 정의, 변수에 함수를 저장하고 실행한다. 하지만 즉시실행함수는 이름 그대로 함수를 정의하자마자 바로 호출하게 된다.<br>

### 즉시실행함수를 이용하여 버그 바로잡기

즉시실행함수에 대한 내용은 다른 블로그에도 잘 작성되어 있다. 그래서 나는 즉시실행함수를 통하여 오류를 바로잡는 예제를 통해 살펴보고자 했다. <br>

```js
function createButtons() {
  for (var i = 1; i <= 5; i++) {
    var body = document.getElementsByTagName("BODY")[0];
    var button = document.createElement("BUTTON");
    button.innerHTML = "Button " + i;
    button.onclick = function() {
      alert("This is Button " + i);
    };
    body.appendChild(button);
  }
}

createButtons();
```

<img src="/media/images/js/iife-btn.png" alt="image" style="width:50%; height:auto;margin-top:1.5rem;">

<figcaption>버튼을 클릭하면 무슨 일이 일어날까?</figcaption>

위의 코드를 보면 해당 버튼을 클릭할 경우 "This is Button <span class="color--red">클릭한 숫자</span>"를 출력할 것으로 생각할 수도 있다.<br>
하지만 실제로 눌러보면 그렇지 않다.

<!-- <p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="yohanpro" data-slug-hash="xxKqKwR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: margin:0 auto; padding: 1em;" data-pen-title="button">
  <span>See the Pen <a href="https://codepen.io/yohanpro/pen/xxKqKwR/">
  button</a> by Yohan Kim (<a href="https://codepen.io/yohanpro">@yohanpro</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script> -->

https://codepen.io/yohanpro/pen/xxKqKwR

모두가 button 6으로 뜬다. 그 이유는 무엇일까?

크롬 개발자 도구를 이용하여 디버깅 해보았다.
<img src="/media/images/js/iife-2.png" alt="image" style="width:80%; height:auto;margin-top:1.5rem;">

위에서 i 이터레이션이 `i<=5`까지이고 `i++`이기 때문에 i=6까지 실행이 된다.<br>
또한 이터레이션 값이 계속 바뀌기 때문에 `onclick` 메소드에 있는 i 값은 계속 바뀌게 된다. <br>

즉 코드를 올바르게 고치려면 `onclick`메소드에 안에 있는 변수 `i`가 외부 영향을 받지 않게 만들어야 한다.<br>
그래서 IIFE를 통해 i값을 캡슐화 시켜 독립된 값으로 만드는 것이다. IIFE를 통해 올바르게 고쳐보았다.<br>

```js
function createButtons() {
  for (var i = 1; i <= 5; i++) {
    var body = document.getElementsByTagName("BODY")[0];
    var button = document.createElement("BUTTON");
    button.innerHTML = "Button " + i;
    (function(num) {
      button.onclick = function() {
        alert("This is Button " + num); //이제 num은 외부의 i값과 상관없이 항상 고정된 값을 가리킨다.
      };
    })(i);
    body.appendChild(button);
  }
}
```

아니면 이렇게 외부 함수로 빼는 방법이 있다. 사실 이게 더 가독성이 좋다. 더 추천하는 방법이다.

```js
function createButtons() {
  for (var i = 1; i <= 5; i++) {
    var body = document.getElementsByTagName("BODY")[0];
    var button = document.createElement("BUTTON");
    button.innerHTML = "Button " + i;
    addClickFunctions(i, button);
    body.appendChild(button);
  }
}
function addClickFunctions(num, button) {
  button.onclick = function() {
    alert("This is Button " + num);
  };
}
```
