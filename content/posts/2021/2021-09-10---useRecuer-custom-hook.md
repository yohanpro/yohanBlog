---
title: 커스텀훅과 useReducer로 Form 만들기
date: "2021-09-10"
template: "post"
draft: false
slug: "/posts/react/custom-hook"
category: "react"
tags:
  - "react"
  - "custom hook"
  - "useReducer"
description: 커스텀훅과 useReducer로 Form 만들기
---

레거시 코드들을 만나게 된다. 사실 이런 레거시 코드들은 볼때마다 기술부채가 쌓이는 것 같아 마음이 무겁고 괴롭다.

이런 Form을 작성하는 곳이 있다.

![screen 2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/18af6c42-f418-4449-aaa1-f3b22b17f9fe/screen_2.png)

이 코드는 이렇게 작성되어 있었다.

```jsx
	const [email, setEmail] = useState<string>();
  const [zipCode, setZipCode] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("Chinese");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [terms, setTerms] = useState([]);
```

```jsx
<Form className="orderForm">
      <Form.Group controlId="krName">
        <Form.Label>{t("fifa_checkout_full_name")}</Form.Label>
        <Form.Control
          type="text"
          placeholder="John Doe"
          value={currentUser.full_name}
          onChange={({ target }) => {
            setEmail(target.value);
          }}
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>{t("fifa_checkout_email")}</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={({ target }) => {
            setEmail(target.value);
          }}
        />
      </Form.Group>
 </Form>
.... 이밖에 이렇게 더
```

그리고 이건 이렇게 쓰이고 있었다. 딱봐도 정말 한숨만 푹푹 나오는 코드다.

문제점은 아래와 같다.

1. Form안에 있는 onChange시 호출되는 중복되는 함수들
2. 너무나 많은 state들로 인한 가독성 저하.
3. state들을 prop으로 넘겨줄때 문제점.

이 상태에서 하위 컴포넌트로 prop을 전달해준다고 생각해보자. 그러면 이렇게 나온다.

```jsx
const formProps = {
      email,
      lastname,
      firstname,
      nationality,
      currentUser,
      detailAddress,
      zipCode,
      selectedLang,
      setNationality,
....
    };

    return <ChinaForm {...formProps} />;
```

타입스크립트를 쓴다면 여기다가 Prop타입들을 지정해줘야 하므로 문제가 점점 늘어난다.

종합적인 문제가 있다는 것을 알고 있었음에도 배포일자가 가까워질수록 레거시로 남게 되어버렸다.

그래도 이번에 완벽하진 않지만 커스텀 훅과 useReducer로 어느정도 반복되는 코드양을 줄였다.

## useFormInput 커스텀 훅 작성

커스텀 훅은 이런 중복되는 코드들을 획기적으로 줄여준다. 가독성이 높아지고 → 유지보수가 쉬워지는 선순환고리가 완성된다.

React가 18버전에서 훅을 도입한 이유가 class간 반복적으로 사용되는 함수들을 재사용하기 위함이 크다.

```jsx
const reducer = (state, action) => {
  return {
    ...state,
    [action.name]: action.value,
  };
};

export const useUserFormInput = (initialState): any => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onChange = (e) => {
    dispatch(e.target);
  };
  return [state, onChange];
};
```

`useUserFormInput`은 useReducer를 사용하고 state와 onChange이벤트를 반환한다.

그리고 이 reducer는 onChange에서 일어난 이벤트를 name에 따라 value값을 집어넣는다.

만약 여기서 좀 더 리팩토링을 한다고 하면 validate하는 로직을 안에다가 추가할 수도 있을 것이다.

그리고 이제 이 useUserFormInput을 해당하는 곳에서 사용해주면 된다.

```jsx
const initalUserFormState = {
    name: "",
    email: "",
    firstname: "",
    lastname: "",
    nationality: "",
    language: "",
    country: "",
    state: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    zipcode: "",
    phone: "",
  };

  const [userInformation, setUserInformation] = useUserFormInput(
    initalUserFormState
  );'

....
<Form.Group controlId="krName">
      <Form.Label>
        {t("fifa_checkout_full_name")}
        <span className={css(styles, "required")}> *</span>
      </Form.Label>

      <Form.Control
        type="text"
        placeholder="John Doe"
        name="name"
        value={userInformation.name}
        onChange={setUserInformation}
      />
 </Form.Group>
```

이제 각 input에는 onChange에는 setUserInformation를 주게 되고 Form에는 name props를 추가해주면 된다.
