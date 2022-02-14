---
title: Typescript Class 사용하기
date: "2022-02-13"
template: "post"
draft: false
slug: "/posts/typescript/class"
category: "typescript"
tags:
  - "typescript"
  - "TS"
  - "class"
  - "private"
  - "protected"
  - "static"
description: Typescript에서 Class를 사용해보자.
---

리팩토링 책을 요즘 보고 있고, 실무에서도 사용하려고 노력중이다. 클래스로 감싸게 되었을때 얻는 이점들이 상당히 많아 보여서 조심스럽게 만들어보려고 하는 중이다.

리팩토링 2판은 javascript로 나왔는데, class로 캡슐화하는 과정에서 Typescript와 차이가 발생한다. 그리고 Typescript 덕분에 리팩토링 코드내에서 사용하는 기법들 중 신경쓰지 않아도 되는 부분들이 있다.

## Getter와 Setter

getter와 setter를 사용할때 js에서는 이렇게 쓴다.

```js
class Animal {
  constructor(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
}
```

typescript로 사용한다면 아래와 같이 속성들을 명시해줘야 한다. 이걸 돌릴 경우 javascript가 해석하지 못하므로, `ts-node`로 돌려야 한다.

> 👉🏻👉🏻 마틴 파울러는 리팩토링 책에서 객체지향 프로그래밍이라면 **객체의 데이터를 항상 private로 유지해야 한다고 강조한다.** 데이터의 유효범위가 넓을수록 관리하기가 어렵고 문제가 생길 경우 처리하기 힘들어지기 때문이다.

<br>

```ts
class Animal {
  _name: string; // 타입 명시
  constructor(name: string) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
}
```

<Br>

속성 선언시 앞에 아무것도 안붙을 경우에는 public으로 간주한다. 내부에서만 사용할 인자라고 하면 아래처럼 private를 써주면 외부에서 사용할 수 없다.

```ts
class Animal {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  set name(arg) {
    this._name = arg;
  }
}
const animal = new Animal("cat");
console.log(animal._name); //'_name' 속성은 private이며 'Animal' 클래스 내에서만 액세스할 수 있습니다.
```

<br>

tsc로 컴파일 해보면 `defineProperty`를 사용하게 된 것을 볼 수 있다.

```js
// tsc 컴파일
var Animal = /** @class */ (function () {
  function Animal(name) {
    this._name = name;
  }
  Object.defineProperty(Animal.prototype, "name", {
    get: function () {
      return this._name;
    },
    set: function (arg) {
      this._name = arg;
    },
    enumerable: true,
    configurable: true,
  });
  return Animal;
})();
var animal = new Animal("cat");
```

<Br>

## protected, private, public

Java를 쓴다면 이미 익숙한 개념이겠지만, 한번 더 짚고 넘어가려고 한다.

- `public`은 클래스 외부에서도 접근 가능
- `protected`는 상속받은 하위클래스에서만 접근가능
- `private`: 선언한 클래스 내부에서만 접근가능

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino; // 에러 없음
animal = employee; // 에러발생 'Employee' 형식은 'Animal' 형식에 할당할 수 없습니다
```

<Br>

위에서 보면 animal 인스턴스에 rhino를 대입할경우 에러가 나지 않지만, animal에 employee를 넣을 경우 형식에 별도의 프라이빗 속성 'name' 선언이 있으므로 에러가 난다.

### JS에서 private 속성 사용

사실 private로 객체 캡슐화를 하는 방법은 Javscript에서도 사용이 가능하다.
아래처럼 메소드나 변수에 `#`을 붙이면 된다.

```js
class ClassWithPrivateField {
  #privateField;
}

class ClassWithPrivateMethod {
  #privateMethod() {
    return "hello world";
  }
}

class ClassWithPrivateStaticField {
  static #PRIVATE_STATIC_FIELD;
}

class ClassWithPrivateStaticMethod {
  static #privateStaticMethod() {
    return "hello world";
  }
}
```

단점은 쓰는걸 아무도 보지 못했다는 걸 빼고는 없는것 같다. 🥺

## static 메서드

static을 쓰게 되면 클래스를 통해 인스턴스를 생성할 필요 없이 키워드를 사용해 속성, 메서드를 정의할 수 있다.

사실 static 자체는 javascript에도 이미 있는 개념이지만, 여기에서 `private, protected`를 사용해서 더 강력하게 사용할 수 있다.

```ts
export class MyClass {
  public static myFunction(text: string) {
    return text;
  }

  private static onlyInsideFunction() {
    console.log("MyClass 클래스 안에서만 사용 가능");
  }
}

MyClass.myFunction("hello");
MyClass.onlyInsideFunction(); // 에러 발생 'onlyInsideFunction' 속성은 private이며 'MyClass' 클래스 내에서만 액세스할 수 있습니다.ts(2341)
```

위처럼 static과 protected 등의 키워드를 함께 사용할 경우 인스턴스 변수를 읽거나 쓸때 가능 여부를 미리 알 수 있으므로 리팩토링 및 생산성에 있어서 매우 좋다.

## 읽기 전용 속성 readonly

readonly 속성을 적용하면 객체 내외부에서 다른 속성으로 설정할 수 없다.

```ts
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  // 오류 발생 Cannot assign to 'name' because it is a read-only property.
  err() {
    this.name = "not ok";
  }
}

const g = new Greeter();
g.name = "also not ok"; // 여기도 마찬가지로 불가능함
```
<br>

### as const 키워드

하지만 readonly로 설정하였다고 하더라도 객체 내부에서는 읽기 전용이 아닌 속성을 설정할 수 있다.

예를 들면 아래와 같이 객체 내부에 있는 값을 바꿀 수 있다.

```ts
class Person {
  readonly info: { name: string; age: number };
}

const person1 = new Person();

person1.info.age += 1; // 에러가 발생하지 않음
person1.info = { name: "John", age: 30 }; // 하지만 여기서는 에러발생
```

만약 이런 경우에는 Typescript3.4 버전에서 추가된 `const assertion`인 as const를 사용하면 된다.
하지만 레코드에 한정이고 클래스 내부에서 as const로 선언할 수는 없는 것 같다.

```ts
let point = [3, 4] as const;
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point); // 'readonly [3, 4]' 형식의 인수는 '[number, number]' 형식의 매개 변수에 할당될 수 없습니다.
// 
```
<br>

### 참고

- [www.typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/classes.html)
- [class에서 this 사용시 주의사항](https://norux.me/61)
- [Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
