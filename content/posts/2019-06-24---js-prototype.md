---
title: Javscript Prototype에 대하여 알아보자. (1)
date: "2019-06-24"
template: "post"
draft: false
slug: "/posts/js-prototype/"
category: "Javascript"
tags:
  - "Prototype"
  - "Javscript"
  - "Web Development"
  - "프로토타입 체이닝"
description: "Javascript는 Prototype 상속 언어이다!"
---

### **Javascript는 Prototype 상속 언어이다!**

<figure>
	<blockquote>
		<p>"Javascript는 프로토타입 상속에 <br>기반을 둔 객체 지향 언어이다."</p>
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

### 프로토타입 체인

모든 객체는 내부 프로퍼티 [[Prototype]]을 가지고 있다. 브라우저를 키고 아무 객체를 생성해보면 그 아래 \_\_proto\_\_가 있는 것을 볼 수 있을 것이다. <br>
이 \_\_proto\_\_는 그 객체에게 상속을 해준 부모 객체를 가리킨다. 따라서 이 객체는 \_\_proto\_\_프로퍼티가 가리키는 부모 객체의 프로퍼티를 사용할 수 있다. 이를 <span class="color--red">프로토타입 체인이라고 한다. <br>
예시를 들어보면 아래와 같다.

```js

const personA ={
	name:"John",
	myName:function(){
		console.log(`Hello my name is ${this.name}!`);
	}
}

const personB = {
	name:"Yohan"
}
personB.__ proto__ = personA;
const personC ={};
personC.__proto__= personB;
personC.myName(); // "Hello my name is Yohan!"
```

분명 PersonC에는 myName이라는 메소드가 없다. 그러나 어찌된 일인지 `'my name is Yohan'`이라는 콘솔 로그를 찍어낸다.<br>

이게 바로 프로토 체인이다.<br>
우선 **PersonC**에서 찾아본 후 해당 메소드가 **PersonC**에 없으면 해당 proto의 부모인 **PersonB**로 간다. <br>만약 **PersonB에서도** 존재하지 않으면 **PersonA에로** 간다.<br> 이런 식으로 점점 올라가 최종으로 **PersonA에** 있는 **myName 메소드를** 호출하게 되는 것이다.<br>

하지만, 당연히 일반적으로 직접 `__proto__`를 써서 상속하지는 않는다. <br>
두 가지의 방법이 있다.

- 생성자(constructor)로 객체를 생성할 때 생성자의 prototype 프로퍼티에 추가하는 방법
- Object.create() 메서드로 상속을 받을 프로토 타입을 지정하여 객체를 생성하는 방법

첫 번째 방법이 우리가 일반적으로 쓰는 방법이다. 즉, `new`를 사용하여 인스턴스를 생성하는 것이다. <br>
그렇다면 `new`를 사용하면 어떤 과정이 내부에서 일어나서 상속을 하게 되는 것일까? JS는 다른 객체지향언어와 어떻게 다를까?<br>

```js
function Person(name, age){
	this.name = name;
	this.age = age;
}
Person.prototype.greet = function(){
	return console.log(`Hello my name is ${this.name} and my age is ${this.age}`);
}

const personA = new Person('John','27')`
```

---

1. 빈 객체를 생성한다.

```js
const newObj = {};
```

2. `Person.prototype`을 생성된 객체의 프로토타입으로 설정한다.

```js
newObj.__proto__ = Person.prototype;
```

    그런데 이때 만약 Person.prototype이 가리카는 것이 객체가 아니라면 `Object.prototype`을 프로토타입으로 설정한다. <br><br>

3. **Person**생성자를 실행하고 **newObj**를 초기화한다.<br> 이 때 **this**는 1에서 생성한 객체로 설정한다. 인수는 **new**연산자와 함께 사용한 인수를 그대로 사용한다.

```js
Person.apply(newObj, arg);
```

4. 완성된 객체를 반환한다.

```js
return newObj;
```

이런식으로 진행되는 것이다. 이처럼 생성자를 new로 하여 생성하게 되면 <br>
**객체 생성, 프로토타입 설정, 객체 초기화를 설정**하게 된다.
