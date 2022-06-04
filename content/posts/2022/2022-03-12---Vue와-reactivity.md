---
title: Vue 와 reactivity
date: "2022-03-12"
template: "post"
draft: false
slug: "/posts/vue/Vue-reactivity"
category: "vue"
tags:
  - "vue"
  - "Proxy"
  - "reactivity"
  - "WeakMap"
description: Vue는 어떻게 Reactivity를 구현했을까?
---


Reactivity는 번역한 그대로 하면 반응성이라고 한다. 하지만 이 말을 그대로 사용하기엔 오히려 그 의미를 온전히 담지 못한다고 생각하기 때문에 그냥 Reactivity라고 부르려고 한다.

React, Vue등 최신 라이브러리와 프레임워크를 사용한다면 반응성이라는 개념을 숨쉬듯이 당연히 생각하고 생각할지 모른다. 하지만 웹 초창기에서 우리가 화면에 입력하고  (input), Javascript에 data를 넣는 행위는 프로그래머들이 일일이 해주어야 하는 일들이었다. 

```tsx
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Still 3
```

위 예를 보면 알 수 있지만, 다시 그냥 값을 대입한다고 해서 A2의 값이 변하지 않는다. 

A2의 값이 4가 되길 원한다면 아래처럼 써야한다.

```tsx
let A2

function update() {
  A2 = A0 + A1
}
```

여기서 우리가 SPA를 만들때 사용하는 용어들 중 중요한 부분을 정의할 수 있다.


> - update라고 쓰인 이 함수는 **effect, side effect**라고  부른다.
> - A0, A1는 **dependencies**라고 부른다. 의존적이라는 말인데, 위의 effect를 실행하는데 쓰이기 때문이다. 적용된 effect는 이 dependency들의 `Subscriber`라고 부른다.

<br>

Vue 공식문서에서도 친절하게 설명해놨지만, 이 개념은 프론트엔드 개발자라면 뇌 안에 박고 넘어가면 좋다. 이 용어들을 되새기다보면 React를 볼때도 `useEffect` 훅에서 Effect란 용어와 `Redux`에서 왜 `Subscribe`와 같은 단어를 좀 더 잘 이해 할 수 있다.

<br>

### Proxy API

Vue2에서는 getter, setter 그리고 DefineProperty를 통해 Reactivity를 구현했다면, Vue3는 `Proxy API`를 써서 구현했다. 

MDN에서는 Proxy를 아래와 같이 기술해놓았다.

>👉 Proxy 객체**를 사용하면 해당 객체에 대한 기본 작업을 가로채고 재정의할 수 있는 다른 개체에 대한 Proxy를 만들 수 있습니다.**

하지만 깊은 복사, 얕은복사와 같은 개념이 아니기 때문에, `Proxy`에 있는 값을 변경하면 원본 함수도 변경된다.  
다만, `===` 연산을 사용해서 비교를 하면 `false`를 반환한다. 

반응성을 구현하려면 앞서서 설명한 것처럼 함수(effect)로 감싸고, 필요한 dependency들을 바인딩 해줘야 한다. 

<br>


### WeakMap

WeakMap은 그냥 Map과 달리 메모리 누수 관리에 메리트가 있는 자료구조이다. MDN에 따르면 Map에는 키와 value에 대한 값을 계속 가지고 있기 때문에 만약 사용되지 않는 참조가 있다고 하더라도 가비지 컬렉터에 포함시키지 않는다. 다만 Map처럼 모든 값들을 열거할 수는 없다.  (이터레이터 프로토콜을 사용할 수 없음)

Vue3에서는 Effect subscriptions를 `Global WeakMap`에 저장한다.  이 Effect가 설정된 적이 없다면 만들어지게 된다. 

```tsx
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // A0과 A1 tracking
  A2.value = A0.value + A1.value
})

// effect 트리거
A0.value = 2
```

Vue는 `watchEffect` 라는 reactive effect를 제공한다. 직접 사용할 일은 잘 없겠지만, 위 예시는 watchEffect로 종속성 검사를 할 Effect를 함수로 전달한다. 그리고 

이게 Vue에서 일어나는 마법인 셈인데, 위를 통해서 VirtualDOM을  Effect에 따라 업데이트 할 수 있게 된다.


### 마무리

결국 React와 Vue가 해결하려고 했던 문제는 같다고 생각한다. 데이터가 변경되었을때, 이를 추적하고 업데이트 해주는 것이다. 각각 다른 방식으로 구현했겠지만, 깊이 있게 들어가면 거의 비슷하게 문제를 해결한 것 같다. 
### 참고

- [Reactivity in Depth | Vue.js](https://vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vue)