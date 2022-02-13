---
title: Typescript Class 사용하기
date: "2022-02-13"
template: "post"
draft: true
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
        configurable: true
    });
    return Animal;
}());
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


## static 메서드 
static을 쓰게 되면 클래스를 통해 인스턴스를 생성할 필요 없이 키워드를 사용해 속성, 메서드를 정의할 수 있다.

사실 static 자체는 javascript에도 이미 있는 개념이지만,  여기에서 `private, protected`를 사용해서 더 강력하게 사용할 수 있다.

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




### 참고 
- [www.typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/classes.html)
- [class에서 this 사용시 주의사항](https://norux.me/61)