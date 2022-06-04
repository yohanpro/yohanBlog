---
title: React State Hooks - useContext
date: "2022-04-17"
template: "post"
draft: false
slug: "/posts/refactoring/useContext"
category: "React"
tags:
  - "useContext"
  - "Context API"
  - "React"
description: Context API를 사용한 State 관리
---

### 참고
- [How to useContext in React](https://www.robinwieruch.de/react-usecontext-hook/)


React Context를 어느 정도 알고 쓸 수 있지만 그래도 기본을 다지자는 의미에서 번역을 하면서 다잡아보기로 하였다. 
최근 팀내 비디오 콜을 듣게 되면서 선임 개발자 분이 이런 이야기를 하셨는데 매우 공감이 가는 이야기이다.

### Redux vs Context API


Redux가 개인 프로젝트 혹은 5명 이하에 팀에서 약속만 잘 된다면 좋은 선택일 수 있다. 
- 하지만 5명 이상이<small>(특히 주니어가 많을 경우)</small> 같은 프로젝트를 작업하다보면 컨벤션에 문제가 생기는 경우가 많아진다.
- Input, Output이 동시 다발적으로 업데이트가 되므로, 디버깅이 어려워 질 수 있다. 
- 필요한 아이템이 있는지 찾아보지도 않고 global state에 고민없이 넣게 되는 경우도 발생


한낯 `Redux`문제가 아니라, 하나의 중앙 State를 관리하는 시스템이`(ex Vuex)`라면 전부 가지고 있는 문제이기도 하다. 
워낙 사용이 쉽기 때문에 공통 State를 잘 아는 사람이 리뷰를 하지 않는다면 중복된 코드가 많이 발생할 수 있다.

`AirBnb`도 초창기에는 Redux를 사용했다가, 전부 `Context API`로 대체했다고 들었다.
이는 Context를 지엽적으로 사용함으로써 코드 유효범위를 줄이려는 시도이며, 더불어서 React 자체 기능만 사용하여 후에 있을 수 있는 라이브러리간 업데이트 문제를 방지하기 위함이 아닐까 생각한다.


---

<br>

## REACT'S USECONTEXT HOOK

사용자에게 책 목록을 표시하려는 서점이 있고 각 책에는 제목과 가격표가 있다. 사용자가 어디에서 왔는지에 따라 원하는 통화로 가격을 표시하려고 합니다. src/App.js가 다음과 같다.

```jsx
import React from 'react';

const DATA = [
  {
    id: '1',
    title: 'The Road to React',
    price: 19.99,
  },
  {
    id: '2',
    title: 'The Road to GraphQL',
    price: 29.99,
  },
];

const App = () => {
  return (
    <div>
      <Books list={DATA} />
    </div>
  );
};

const Books = ({ list }) => {
  return (
    <ul>
      {list.map((item) => (
        <Book key={item.id} item={item} />
      ))}
    </ul>
  );
};

const Book = ({ item }) => {
  return (
    <li>
      {item.title} - {item.price}
    </li>
  );
};

export default App;
```

<br>

React Context는 `React.createContext`를 top-level에서 초기화가 된다. 이 Context는 전체 어플리케이션에서 재사용할 것이기 때문에 별도의 파일로 존재하는게 좋다. (e.g src/currency-context.js , src/contexts/currency.js)

```jsx
import React from 'react';

const CurrencyContext = React.createContext(null);

export { CurrencyContext };
```
<br>



React의 createContext는 Privider에 초기값(기본값)을 받게 된다.  여기서는 유로화<small>€</small>를 static한 값으로 제공을 하였다. 

```jsx
import React from 'react';

import { CurrencyContext } from './currency-context';

...

const App = () => {
  return (
    <CurrencyContext.Provider value="€">
      <Books list={DATA} />
    </CurrencyContext.Provider>
  );
};
```
<br>

이 Context Object는 가장 자주 쓰이는 곳 최상단에 위치해야 한다. 그래야 이를 사용하는 모든 Child Component에서 사용할 수 있다.

즉, prop으로 내려주는게 아니라 context로 내려준다. 

또한 Context Object는 이 Context에 엑세스해야하는 모든 Child Component에서 사용할 수 있는 `Consumer`를 제공한다. 

```jsx
const Book = ({ item }) => {
  return (
    <CurrencyContext.Consumer>
      {(currency) => (
        <li>
          {item.title} - {item.price} {currency}
        </li>
      )}
    </CurrencyContext.Consumer>
  );
};
```
<br>

이 방법은 hooks를 사용하지 않고 만들 수 있는 가장 기본적인 방법이다. 하지만 이 Context는 다른 곳에서도 사용되어 질 수 있다. 

이제 이 Context를 hooks로 마이그레이션하는 방법을 소개한다. React Hooks에서는 prop을 사용안할 수도 있다. 

위 코드는 Hook을 사용하면 아래와 같이 변경된다.

```jsx
const Book = ({ item }) => {
  const currency = React.useContext(CurrencyContext);

  return (
    <li>
      {item.title} - {item.price} {currency}
    </li>
  );
};

```
React의 `useContext Hook은` Context를 parameter로 받아 값을 찾는다.  React Hook을 사용하면  확연히 코드를 더 읽기 쉽게 만든다. 또한 불필요한 Consumer Componet를 제거할 수 있다는 것도 장점이다. 

---

## STATEFUL CONTEXT IN REACT WITH USECONTEXT


위 예시에서는 state가 없었다. 하지만 대부분의 경우 state가 존재한다. 사용자가 통화를 변경하고 통화 기호를 변경하고 싶을 수 있다. 

```jsx
const App = () => {
  const [currency, setCurrency] = React.useState('€');

  return (
    <CurrencyContext.Provider value={currency}>
      <button type="button" onClick={() => setCurrency('€')}>
        Euro
      </button>
      <button type="button" onClick={() => setCurrency('$')}>
        US Dollar
      </button>

      <Books list={DATA} />
    </CurrencyContext.Provider>
  );
};
```
<br>

직관적인 코드로 버튼을 클릭하게 되면 인라인 이벤트가 state를 변경하며 리렌더링을 발생시킨다. 수정된 값은 Provider를 통해 해당 값을 subscribe하는 모든 하위 Component에게 전달된다.

dictionary 자료구조를 통해 좀 더 알아보자. 

```jsx
const CURRENCIES = {
  Euro: {
    symbol: '€',
    label: 'Euro',
  },
  Usd: {
    symbol: '$',
    label: 'US Dollar',
  },
};

const App = () => {
  const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

  return (
    <CurrencyContext.Provider value={currency}>
      <button
        type="button"
        onClick={() => setCurrency(CURRENCIES.Euro)}
      >
        {CURRENCIES.Euro.label}
      </button>
      <button
        type="button"
        onClick={() => setCurrency(CURRENCIES.Usd)}
      >
        {CURRENCIES.Usd.label}
      </button>

      <Books list={DATA} />
    </CurrencyContext.Provider>
  );
};

...

const Book = ({ item }) => {
  const currency = React.useContext(CurrencyContext);

  return (
    <li>
      {item.title} - {item.price} {currency.symbol}
    </li>
  );
};
```
<br>

그 다음으로 할 일은 위 dictionanry를 Object value를 통해 mapping하여 렌더링 하는 방식으로 변경하는 것이다. 추후에 값이 더 늘어날 수도 있으므로 장기적인 관점에서 좋다. 

```jsx
const CURRENCIES = {
  Euro: {
    symbol: '€',
    label: 'Euro',
  },
  Usd: {
    symbol: '$',
    label: 'US Dollar',
  },
};

const App = () => {
  const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

  return (
    <CurrencyContext.Provider value={currency}>
      {Object.values(CURRENCIES).map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => setCurrency(item)}
        >
          {item.label}
        </button>
      ))}

      <Books list={DATA} />
    </CurrencyContext.Provider>
  );
};
```
<br>

세 번째로 할일은 button들을 재사용가능하게 만드는 것이다. App이 좀 더 깔끔해졌다. 
```jsx
const App = () => {
  const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

  return (
    <CurrencyContext.Provider value={currency}>
      <CurrencyButtons onChange={setCurrency} />

      <Books list={DATA} />
    </CurrencyContext.Provider>
  );
};

const CurrencyButtons = ({ onChange }) => {
  return Object.values(CURRENCIES).map((item) => (
    <CurrencyButton key={item.label} onClick={() => onChange(item)}>
      {item.label}
    </CurrencyButton>
  ));
};

const CurrencyButton = ({ onClick, children }) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};
```

<br>

그리고 `conversionRate`를 dictionary에 추가해주자. 

```jsx
const CURRENCIES = {
  Euro: {
    code: 'EUR',
    label: 'Euro',
    conversionRate: 1, // base conversion rate
  },
  Usd: {
    code: 'USD',
    label: 'US Dollar',
    conversionRate: 1.19,
  },
};

...

const Book = ({ item }) => {
  const currency = React.useContext(CurrencyContext);

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
  }).format(item.price * currency.conversionRate);

  return (
    <li>
      {item.title} - {price}
    </li>
  );
};
```
<br>

이렇게 바꿈으로서 Context를 stateful하게 변경하였다. 

---

## useContext와 Context 사용하기 

프로젝트가 커진다면 Context를 useContext를 이용해서 사용하는 것이 좋다. 

필수적으로 사용해야 하는 부분을 먼저 선언해준다.
```jsx
import React from 'react';

const CurrencyContext = React.createContext(null);

export { CurrencyContext };
```
<br>

이전 예와는 다르게, Context를 사용하는 부분은 custom Context hook을 사용하는 것으로 바꾸어 준다. 
```jsx
import React from 'react';

const CurrencyContext = React.createContext(null);

const useCurrency = () => React.useContext(CurrencyContext);

export { CurrencyContext, useCurrency };
```
<br>

그리고 이 custom context 훅을 중간 단계 없이 사용해준다. 

```jsx
import React from 'react';

import { CurrencyContext, useCurrency } from './currency-context';

...

const Book = ({ item }) => {
  const currency = useCurrency();

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
  }).format(item.price * currency.conversionRate);

  return (
    <li>
      {item.title} - {price}
    </li>
  );

```
<br>

만약 styled-component같은 서드파티 라이브러리들을 사용한다면 HOC패턴을 이용할 수 있다. 
```jsx
import React from 'react';

const CurrencyContext = React.createContext(null);

const useCurrency = () => React.useContext(CurrencyContext);

const withCurrency = (Component) => (props) => {
  const currency = useCurrency();

  return <Component {...props} currency={currency} />;
};

// if ref is used
//
// const withCurrency = (Component) =>
//   React.forwardRef((props, ref) => {
//     const currency = useCurrency();

//     return <Component {...props} ref={ref} currency={currency} />;
//   });

export { CurrencyContext, useCurrency, withCurrency };
```
<br>

세 번째로 custom context hook을 사용하는 것과 비슷하게, custom Provider를 만든다.

```jsx
import React from 'react';

const CurrencyContext = React.createContext(null);

const useCurrency = () => React.useContext(CurrencyContext);

const CurrencyProvider = ({ value, children }) => {
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyProvider, useCurrency };
```
<br>

알아두어야 할 것은 CurrencyContext 그 자체는 아무것도 제공하지는 않는다는 것이다. 
그 대신에 이 Provider는 App에서 사용되며 stateful한 value를 사용한다. 

```jsx
import React from 'react';

import { CurrencyProvider, useCurrency } from './currency-context';

...

const App = () => {
  const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

  return (
    <CurrencyProvider value={currency}>
      <CurrencyButtons onChange={setCurrency} />

      <Books list={DATA} />
    </CurrencyProvider>
  );
};
```
<br>

또한 여기서 모든게 캡슐화가 되어있기 때문에 직접 Provider에 있는 state를 조작할 수는 없다. 

지금 상태의 코드는 전체 통화관련 기능들이 여기저기 흩어져 있는데, 이를 React의 Context에 더 많이 캡슐화하는 방법을 살펴보자. 즉, React의 Context의 API를 외부로 제공하는 방법이다.

첫 번째 할일은 dictionary를 context file로 옮기는 것이다. 

```jsx
import React from 'react';

const CURRENCIES = {
  Euro: {
    code: 'EUR',
    label: 'Euro',
    conversionRate: 1, // base conversion rate
  },
  Usd: {
    code: 'USD',
    label: 'US Dollar',
    conversionRate: 1.19,
  },
};

...

export { CurrencyProvider, useCurrency, CURRENCIES };


import {
  CurrencyProvider,
  useCurrency,
  CURRENCIES,  // <- 추가됨
} from './currency-context';
```
<br>

그리고 App에서 Provider에 제공하는 값으로 상태 업데이트 하는 기능도 같이 넣어준다. 

```jsx
const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = React.useState(CURRENCIES.Euro);

  return (
    <CurrencyContext.Provider value={[currency, setCurrency]}>
      {children}
    </CurrencyContext.Provider>
  );
};

```
<br>

custom hook(useCurrency)에서도 업데이트 하는 로직을 넣어주자. 

```jsx
//최종 코드
const useCurrency = () => {
  const [currency, setCurrency] = React.useContext(CurrencyContext);

  const handleCurrency = (value) => {
    setCurrency(value);
  };

  return { value: currency, onChange: handleCurrency };
};
```
<br>

```jsx
const App = () => {
  return (
    <CurrencyProvider>
      <CurrencyButtons />

      <Books list={DATA} />
    </CurrencyProvider>
  );
};

const CurrencyButtons = () => {
  const { onChange } = useCurrency();

  return Object.values(CURRENCIES).map((item) => (
    <CurrencyButton key={item.label} onClick={() => onChange(item)}>
      {item.label}
    </CurrencyButton>
  ));
};

...

const Book = ({ item }) => {
  const { value } = useCurrency();

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: value.code,
  }).format(item.price * value.conversionRate);

  return (
    <li>
      {item.title} - {price}
    </li>
  );
};
```
<br>

이게 전부다. 위 코드를 훑어보면 state와 state를 업데이트 할 수 있는 로직을 Context Provider와 hook을 사용해서 캡슐화하였다. 

외부에서 접근하려고 하면 무조건 hook을 사용해야 하며, 이렇게 접근을 제한할 수 있어야 어디에서 업데이트가 이루어지는지 데이터 흐름을 파악하기 쉬워진다. 