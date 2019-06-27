---
title: Javscript Prototype에 대하여 알아보자. (1)
date: "2019-06-19"
template: "post"
draft: false
slug: "/posts/js-prototype/"
category: "Typography"
tags:
  - "Prototype"
  - "Javscript"
  - "Web Development"
  - "프로토타입 체이닝"
description: "Javascript는 Prototype 상속 언어이다!"
---

### Javascript는 Prototype 상속 언어이다!

<figure>
	<blockquote>
		<p>"Javascript는 프로토타입 상속에 기반을 둔 객체 지향 언어이다."</p>
		<footer>
			<!-- <cite>— Aliquam tincidunt mauris eu risus.</cite> -->
		</footer>
	</blockquote>
</figure>

이 말은 처음 Javascript를 배울 때 한번쯤은 듣게 되는 문구이다. <br>사실 JS를 접하게 되면 이 문구가 처음에는 와닿지도 않고 무슨 말인지도 잘 모른다.<br>

하지만 <u>JS를 깊이 배울수록 저 문구가 참 JS 본질을 꿰뚫는 핵심 문구라는 것을 느끼고 있다.</u><br>
Java와 C++등 객체 지향 언어에서는 Class를 상속하기 위한 별도의 구문이 있다. <br>
물론 ES6에 들어서 class라는 문법이 Javascript에 추가되었지만 Java나 C++와 같은 언어에서 사용하는 개념과는 다르다.<br>

내가 만든 객체가 어떻게 생성되고 어떤 과정을 거쳐서 사용할 수 있게 되는 것인지 아는 것은 정말 중요하다. <br>
따라서 Prototype 생성을 포스팅하여 내 머릿속에 추상적으로 잡혀있는 Prototype에 대한 정리를 해두려고 한다.<br>

#### 프로토타입 체인

---

모든 객체는 내부 프로퍼티 [[Prototype]]을 가지고 있다. 브라우저를 키고 아무 객체를 생성해보면 그 아래 \***\*proto\*\***가 있는 것을 볼 수 있을 것이다. <br>
이 **proto**는 그 객체에게 상속을 해준 부모 객체를 가리킨다. 따라서 이 객체는 **proto**프로퍼티가 가리키는 부모 객체의 프로퍼티를 사용할 수 있다. 이를 <span class="color--red">프로토타입 체인이라고 한다. <br>
예시를 들어보면 아래와 같다.

```js

const personA ={
name:"John",
myName:function(){console.log(`Hello my name is ${this.name}!`);}
}

const personB = {
name:"Yohan"
}
personB. \_\_ proto\** = personA;
const personC ={};
personC.*proto\*\* = personB;
personC.myName(); // "Hello my name is Yohan!"
```
