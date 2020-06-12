---
title: useEffect hook에 대해 더 알아보자
date: "2020-06-07"
template: "post"
draft: false
slug: "/posts/react/use-effect"
category: "react"
tags:
  - "react hook"
  - "useEffect"
  - "useEffect 무한루프"
  - "react"
description: useEffect를 좀 더 자세히 알아보자.
---

useEffect를 사용할 때마다 항상 느껴지는 찝찝함을 견디다 못해 useEffect를 좀 더 깊숙히 알아보고자 하였다.

내가 가장 고민하는 부분은 아래와 같았다.

1. useEffect를 사용할 때 가끔씩 무한루프에 빠져버린다.
2. 두 번째로 오는 인자의 정체
3. useEffect로 `componentDidMount` 효과를 주고 싶은데 어떻게 해아할까?
4. useEffect의 클린업 이벤트는 도대체?

<hr>

## React에서 반드시 명심해야할 개념

hook 안에 `const [count,setCount] =useState()`로 하고

```jsx
const [count, setCount] = useState();

<div>{count}</div>;
```

와 같이 사용할 때 count라는 것이 어디에 묶여있어서 자동으로 변경되는 게 아니다. 사실 count는 그냥 상수일 뿐이다.

state를 변경하게 되면 react에서는 다시 렌더링 하는 과정을 거치는 데 이때
특정 랜더링 시 그 내부에서 props와 state는 영원히 같은 상태로 유지된다.

> `useEffect`도 별반 다르지 않다.<br> 항상 같은 effect 함수가 매번 랜더링 할때마다 별도로 존재한다.

사실 이 말이 모든 것을 꿰뚫는 본질이다고 생각한다. 이걸 전제로 머릿속에 박아놓고 나니 조금 더 근원적인 측면에서 react를 바라볼 수 있게 되었다.

## useEffect에서 무한루프가 발행하는 이유

흔히 하는 실수 중 하나이다. 만약 `useEffect` 함수 안에 의존성 배열을 명시하지 않고 state를 변경하는 작업을 한다면 무한루프가 발생한다. 아래와 같이 말이다.

```js
const Example = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); //무한루프 발생
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
};
```

DOM이 렌더링 되면 useEffect가 실행되고 useEffect안에서 다시 count를 변경한다.

## 두번째 인자의 정체

이를 막기 위해서는 이렇게 두 번째 인자로 의존성 배열을 명시해줘야 한다. 리액트는 컴포넌트가 변경된다고 하더라도 count가 달라졌나 확인하고 달라지지 않았다면 effect를 실행하지 않을 것이다.

```js
const Example = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {}, [count]); //count가 변경되었을때에만 useEffect 실행

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
};
```

이 두번째 인자를 활용하면 `componentDidMount`와 같은 효과를 낼 수 있다.
만약 이 useEffect가 초기에만 필요하고 다시는 필요하지 않다면 아래와 같이 빈 배열을 사용하면 된다.

```js
useEffect(() => {
  setCount(count + 1);
}, []);
```

<hr>

## useEffect의 클린업 이벤트

클린업 이벤트는 react가 DOM에 그리고 난 이후에 실행이 된다.
아래는 매초마다 count를 1씩 올려주는 코드의 예시이다. 클린업은 쉽게 생각하면 useEffect를 뒷정리 해주는 거라고 생각하면 된다. 주로 setInterval이나 setTimeOut과 같은 함수들을 사용할 때 사용한다.

즉 `componentunMount`와 비슷하다.

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <>
      <h1>{count}</h1>
    </>
  );
}
```

나의 경우는 실제 프로젝트시에 이렇게 사용했다. 내가 만든 어떤 컴포넌트의 경우 이 컴포넌트를 벗어날 때 (즉 컴포넌트가 unmount될때 )
리덕스 스토어에 dispatch를 해줘야하는 상황이었다.
이런 경우에는 dispatch를 클린업 이벤트에 넣어주는 게 좋다.

```js
useEffect(() => {
  //useEffect의 클린업 이벤트로 주게되면 unmount될 시에 실행된다.
  return () => {
    dispatch({
      type: types.CHECK,
      payload: {
        checked: true,
      },
    });
  };
}, []);
```
