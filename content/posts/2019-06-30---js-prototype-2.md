---
title: Javscript Prototype에 대하여 알아보자. (2)
date: "2019-06-30"
template: "post"
draft: false
slug: "/posts/js-prototype-2/"
category: "Javascript"
tags:
  - "Prototype"
  - "Javscript"
  - "Web Development"
  - "프로토타입 체이닝"
description: "Javascript는 Prototype 상속 언어이다!"
---

## 프로토 타입 객체의 Property

함수를 정의하게 되면 함수 객체는 기본적으로 prototype 프로퍼티를 갖게 된다. <br>
이 prototype은 기본적으로 constructor 프로퍼티와 내부 프로퍼티를 갖고 있다.

![기본 프로퍼티](/media/images/js/property.png)
<small class="caption">함수 생성시 기본 프로퍼티</small>

위 스크린샷에서 볼 수 있는 것처럼 func가 기본적으로 갖고 있는 프로퍼티는 두 가지이다.<br>
**constructor와 \_\_proto\_\_** 과연 이 두 프로퍼티는 뭘까?

### constructor 프로퍼티

```js
function func() {}
console.log(func.prototype.constructor); //ƒ func() {}
```

생성자와 생성자의 객체는 서로를 참조한다. 이 두가지가 연결고리로 묶여 있게 된다.
하지만 생성자로 생성한 인스턴스는 생성될 때의 프로토타입 객체의 참조만 가지고 있을 뿐 생성자와는 연결고리가 없다.<br><br>
![기본 프로퍼티](/media/images/js/property-2.png)
<small class="caption">생성자와 프로토타입 객체는 서로를 가리키고 인스턴스는 프로토타입 객체를 가리킨다.</small>

### 내부 프로퍼티 [[Prototype]]

함수 객체의 프로토 타입 중 내부 프로퍼티 [[Prototype]]는 기본적으로 최상위 객체인 **Object.prototype**을 가리킨다.<br><br>
![기본 프로퍼티](/media/images/js/property-3.png)

따라서 프로토타입 체이닝을 통해 우리는 Object.prototype에 있는 <em style="color:red;">toString, hasohasOwnProperty, valueOf과 같은 </em>
Object의 프로퍼티를 사용할 수 있게 된다.

이렇게 프로토타입 체이닝을 통해 모든 객체가 최종적으로 Obejct를 **상속** 받게 된다. 그럼 이제 Object.protype에는 어떤 메소드가 있는지 다음 포스팅에서 알아보도록 하겠다.
