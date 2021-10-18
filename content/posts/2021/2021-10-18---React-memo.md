---
title: React memo를 써야할때. 쓰지 말아야 할 때.
date: "2021-10-18"
template: "post"
draft: false
slug: "/posts/react/react-memo"
category: "react"
tags:
  - "react"
  - "react memo"
description: React 메모 파헤치기
---
성능에 관한 글을 쓴 적이 있었는데 정확히 잘 아나? 의문이 들었다. 

React.memo를 잘 사용하지 못하고 있는 건 아닌가? 어떤 조건에서 쓰이고 원리는 무엇이며 언제 써야 하는가?

Kent 형님 블로그를 돌아다니던 중 좋은 글을 보게 되었고 생각을 정리해보려고 한다.

[Use React.memo() wisely](https://goongoguma.github.io/2021/09/22/Use-React.memo()-wisely/)
군고구마님의 블로그다

## React.memo 원리

공식문서 나온 문서를 참고하면 React는 HOC패턴을 사용한다. memo로 감싼 컴포넌트를 렌더링할 때 이전에 기억하고 있던 (메모이제이션) 결과물을 메모리에 기억해두고 있다가 재사용하게 된다. 

메모이제이션을 설명하려면 너무 길어질 것 같아서 건너뛰기로 한다.(~~잘 모른다~~)

무튼 memo는 만능이 아니고 사용할때 주의해야할 점들이 몇몇 있다. 가끔가다가 의미없이 습관적인 memo를 사용하는 일들이 있는데 이를 제거하는게 필요하다. 

얕은 복사를 수행한다. 깊은 복사까지 하고 싶으면 따로 비교하는 함수를 작성해서 prop으로 넘겨야 한다.

## 그래서 언제쓰라고?

참고한 블로그에 따르면 아래와 같은 상황에서 사용하면 좋다. 

![https://goongoguma.github.io/assets/memo-1.jpg](https://goongoguma.github.io/assets/memo-1.jpg)

1. `순수 함수 컴포넌트` 일때 → 이건 요즘 다 클래스형이 아니라 함수형으로 작성하기 때문에 넘어가도 괜찮다.
2. Renders often → 자주 렌더링 될때 : 말 그대로 빈번하게 렌더링 되는 것들. Profile로 체크할 수 있다.
3. **같은 prop으로 리렌더링 될때** : 똑같은 prop을 가지고 있는데 계속 리렌더링 될때. 보통 Input을 작성할 때 계속 상관없는 컴포넌트가 렌더링 되는 것을 본 적 있을 텐데 이를 의미한다.
4. **컴포넌트가 클 때**: 말 그대로다. 그런데 이 네 번째 조건은 굳이 안 넣어도 되지 않았을까?

## 이럴 때 쓰지마라

한문장으로 정리된다.

><b>"컴포넌트가 무겁지 않고 자주 다른 props로 렌더된다면 React.memo()가 그다지 필요하지는 않습니다."</b>

그러니까 토이 프로젝트에서 연습할 목적이 아니라면 거의 안써도 된다. 우리가 쓰는 하드웨어와 브라우저는 생각보다 고성능이다.

검색 조건에 따라 상품들이 바뀌거나, 상품을 클릭했을때 보여지는 결과값 페이지들은 다른 Prop들을 계속 받아와서 렌더링 하기 때문에 memo로 이점을 얻기 어렵다.

Input 필드가 있어서 타이핑 할때마다 해당 컴포넌트가 계속 렌더링 될 때도 있어서 이럴때는 쓰면 좋다. 하지만 컴포넌트가 무겁지 않다면 굳이 할 필요가 없다.

### Useless props comparison

자주 바뀌는 Prop을 받아 렌더링하는 컴포넌트에 memo로 감싸는 건 무의미한 짓이다. 오히려 안쓰느니만 못하다.  memo는 바뀐 prop을 검사해서 렌더링 여부를 결정하게 되는데 어차피 계속 prop들이 바뀌므로 렌더링을 해준다. 

불필요하게 조건문을 더 돌게 되는 일만 수행하게 될 뿐이다.

### 함수를 넘길때 주의

```jsx
function Logout({ username, onLogout }) {
  return (
    <div onClick={onLogout}>
      Logout {username}
    </div>
  );
}

const MemoizedLogout = React.memo(Logout);
```

위와 같은 Logout 컴포넌트가 있고 상위 부모컴포넌트인  Myapp에서 사용한다고 하자.

```jsx
function MyApp({ store, cookies }) {
  return (
    <div className="main">
      <header>
        <MemoizedLogout
          username={store.username}
          onLogout={() => cookies.clear('session')}
        />
      </header>
      {store.content}
    </div>
  );
}
```

위와 같이 사용하면 메모이제이션 효과가 없다.  함수는 똑같은 콜백함수(여기서는 onLogout)를 주고 있기 때문이다. 

이를 해결하려면 다시 `useCallback`으로 `onLogout`을 감싸줘야 한다. 

```jsx
const onLogout = useCallback(
    () => cookies.clear('session'), 
    [cookies]
);
```

이렇게 해주면 cookie 값이 달라지지 않는 이상 useCallback이 같은 콜백함수를 리턴하기 때문에 메모이제이션 효과를 볼 수 있다.