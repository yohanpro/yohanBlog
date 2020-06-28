---
title: react-datepicker 사용법
date: "2020-06-27"
template: "post"
draft: false
slug: "/posts/react/react-datepicker"
category: "react"
tags:
  - "react-datepicker"
  - "react"
  - "react-datepicker 달력"
  - "Custom Header"
  - "moment와 함께"
  - "한국어 적용방법"
  - "scss 적용"
  - "선택시 사라지지 않게 처리"

description: react-datepicker 사용법
---

달력을 만드는 것은 라이브러리를 사용해서 만드는 경우가 대다수 일 것이다. 다운로드 수가 많은 react-datepicker를 사용해서 실무 프로젝트에 사용하게 되었는데,
삽질하면서 얻은 교훈들을 정리해두면 내가 다음에도 만들때 도움을 얻을 수 있을 뿐 아니라, 다른 사람들에게도 도움이 될 수 있을까 싶어 정리해 두기로 하였다.

## react-datepicker

만드는 것은 꽤나 간단한 편이고 [demo](https://reactdatepicker.com/) 페이지에 잘 나와있으므로 잘 따라하면 금방 만들 수 있다.
내가 필요했던 것은 "Custom Header", 포탈을 사용해서 모달 처리하기 등이 있었다.

## 한글 적용

한글을 적용하는 것은 아래와 같이 하면 된다.

```js
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale("ko", ko);

<DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  locale="ko"
  placeholderText="Weeks start on Monday"
/>;
```

<br>

#### 한글로 요일까지 표시하기

만약 **2020년 1월 1일 (수)**와 같이 표시하고 싶다면 아래와 같이 하면 된다.
moment를 다루는 것과 동일하다고 공식문서에는 되어 있는 것 같은데, 이 부분은 조금 다르다.

```js
dateFormat = "yyyy.MM.dd(eee)";
```

eeee 하게되면 "수요일"까지 표시된다.

## 선택해도 사라지지 않게 만들기

`shouldCloseOnSelect={false}`를 주게 되면 선택해도 사라지지 않는다.

다만 문제가 있는 것은 이렇게 할 경우 어떻게 닫기를 적용해 줄 것인지이었다. 현재 이 프로젝트의 경우에는 특히나 모달을 사용해서 띄웠기 때문에 처리가 필요했다.

고민 끝에 사용한 방법은 `useRef` 훅을 사용해서 calendar의 current 값을 가져온 후 `setOpen`을 설정하는 방법이었다.
또한 current 프로퍼티를 변경한다고 해서 리렌더링을 발생시키지 않는다는 점도 마음에 든다.

```js
const [currentDate, setCurrentDate] = useState();
const calendar = useRef(null);

const cancelDatePicker = () => {
  setStartDate(currentDate);
  calendar.current.setOpen(false);
};

const openDatePicker = () => {
  calendar.current.setOpen(true);
};

const closeDatePicker = () => {
  setCurrentDate(startDate);
  calendar.current.setOpen(false);
};
...

<DatePicker
  withPortal
  className="date date-record"
  locale="ko"
  selected={startDate}
  minDate={minDate}
  maxDate={maxDate}
  dateFormat="yyyy.MM.dd(eee)"
  useWeekdaysShort={true}
  shouldCloseOnSelect={false}
  useWeekdaysShort={true}
  excludeDates={excludeDates}
  ref={calendar}
/>;
```

<br>

## custom header 만들기

demo에 나와있는 것을 그대로 따라하면 오류가 난다. 그 이유로는 `getMonth`,`getYear`등의 함수를 못가져 온다는 것인데, 이는 `date-fns` npm 모듈을 설치해 주면 된다.

```bash
$ npm i -S date-fns
```

그런 후에 필요한 라이브러리를 다음과 같이 import 해주어야 한다.

```js
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
```

<Br/>

### 버튼을 눌러도 제대로 작동을 안 할때

여기까지만 해도 잘 되는 사람이 있겠지만, 나의 경우는 달을 바꾸는 버튼이 제대로 작동하지 않았다.<br>
분명 demo페이지에 나온 그대로 복붙해서 넣어도 안된다.

해결방법은 button으로 되어 있는 것을 div로 바꾸어 주면 된다.

### 최종 Datepicker jsx 코드와 렌더링 결과

```jsx
<DatePicker
  withPortal
  className="date date-record"
  locale="ko"
  selected={startDate}
  minDate={minDate}
  maxDate={maxDate}
  dateFormat="yyyy.MM.dd(eee)"
  useWeekdaysShort={true}
  shouldCloseOnSelect={false}
  useWeekdaysShort={true}
  excludeDates={excludeDates}
  ref={calendar}
  onInputClick={() => openDatePicker()}
  onChange={(date, event) => datePickHandler(date, event)}
  renderCustomHeader={({
    date,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    decreaseMonth,
    increaseMonth,
  }) => (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="btn_month btn_month-prev"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <img src="/static/images/arrow-black-left.png" />
      </div>
      <div className="month-day">
        {getYear(date)}.{months[getMonth(date)]}
      </div>

      <div
        className="btn_month btn_month-next"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <img src="/static/images/arrow-black-right.png" />
      </div>
    </div>
  )}
>
  <div className="button-container">
    <div className="btn_ctrl btn_ctrl-cancel" onClick={cancelDatePicker}>
      {" "}
      취소
    </div>
    <div className="btn_ctrl btn_ctrl-confirm" onClick={closeDatePicker}>
      선택
    </div>
  </div>
</DatePicker>
```

<br>

<img  style="width:30%; border-radius:10px;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/react/datepicker.png">
