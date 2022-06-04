---
title: 흩어져 있는 함수를 하나로 합치기
date: "2022-01-15"
template: "post"
draft: false
slug: "/posts/refactoring/combine-functions-into-transform"
category: "javascript"
tags:
  - "여러 함수를 변환함수로 묶기"
  - "combine-functions-into-transform"
  - "리팩토링"
  - "6.10장"
  - "리팩토링 도서 정리"
description: 리팩토링 기법. 여러 함수를 변환함수로 묶기
---

helper 함수들을 하나씩 만들다 보면 종종 너무 많아지는 경우가 발생할 수도 있다.

이렇게 되면 작성한 나는 어디에 어떤 함수가 있는지 알 수 있겠지만<small> ~~(이것도 시간 지나면 잊어먹기 쉽상이다.)~~</small>, 다른 사람이 수정할 때 이미 존재하는 함수인지도 모르고 다시 작성한다거나, 모르고 지나치는 일도 발생할 수 있다.

하나의 __변환함수나 클래스__로 만들어 두면 해당 부분을 가져오거나 인스턴스를 만들어서 사용하게 되므로, 이러한 실수를 방지할 수 있다. 또한 관리하기가 쉬워진다는게 장점이다.

### 변환함수
- 변환함수는 원본 데이터를 입력받아서 필요한 정보를 모두 도출하고, 각각을 출력 데이터의 필드에 넣어서 보관한다.
- 여러 함수를 클래스로 묶기(6.9)로 사용해도 되나 원본 데이터가 코드 안에서 갱신될 일이 생기면 클래스로 묶는다
- 여러 함수를 하나 묶는 이유는 도출 로직이 중복되는 것을 막기 위해서이다.

<br>

### 변환함수의 장점

- 데이터를 입력 받고 여러 정보를 내보낸다고 가정하자. 
그럴 경우 이 정보가 사용되는 곳마다 같은 도출 로직이 반복될 수 있다.
- 한곳에 모아두게 되면 __검색, 갱신을 한 곳에서 처리 가능하고, 로직 중복도 막을 수 있다.__

<Br>

### 예제 (상품에 대한 과세를 계산)

```jsx
reading = { customer: "john", quantity: 10, month: 5, year: 2022 };

const aReading = acquireReading();
const baseCharge = baseRate(aReading.month, aReading.year) * aReading.quantity;

/*
 아래 함수는 기본 면세 범위를 제외하고 과세하는 함수이다. 
 위에서 baseCharge를 계산하는 걸 똑같이 아래에서 사용하고 있다. 
*/

const aReading = acquireReading();
const base = baseRate(aReading.month, aReading.year) * aReading.quantity; //중복 발생
const taxableCharge = Math.max(0, base - taxThreshold(aReading.customer));
```


이렇게 중복 코드가 생기게 되면 나중에 무조건 수정할 일이 생긴다. 특히 위의 예제는 과세 계산 로직이 달라질 경우 또 보게 될것이다.

이럴 경우 똑같은 로직을 하나의 함수로 묶어서 사용하는 것이 좋은데. 문제는 이런게 이미 만들어져 있다고 할때 어디에 있는지도 모를때가 많다는 것이다. 


그래서 찾아보니 정말 예전 작업자가 남겨둔 함수가 있다고 가정하자.<small>(실제로도 보통 그렇다.)</small>

### 함수 추출하기를 사용한 중복 제거
```jsx
const aReading = acquireReading();
const basicChargeAmount = calculateBaseCharge(aReading);

// 찾아보니 다른 사람이 이미 만들어 놓은 함수가 있구나!
function calculateBaseCharge(aReading) {
  return baseRate(aReading.month, aReading.year) * aReading.quantity;
}
```

위처럼 중복제거를 할 수 있지만, 중복제거용으로 따로 만들어둔 함수들이 굉장히 많아질 수도 있다.

이제 변환함수를 만들어서 중복을 제거해보자.


<br>

#### 단계 1. 입력객체를 그대로 깊은 복사해서 반환하는 함수를 만든다.

깊은 복사 방법으로는 재귀함수로 직접 만드는 방법과 JSON.strigify를 사용하는 방법이 있지만, 유명한 `lodash`의 `cloneDeep`을 사용하는게 깔끔해보인다.

 > 😱 **주의:**  `Object.assign`이나 `spread operator`는 깊은 복사가 아니다.

```jsx
// 변환함수를 만들었다. 일단 깊은복사로 반환만 하자.
function enrichReading(original) {
  const result = _.cloneDeep(original);
  return result;
}
```
<br>

#### 단계 2. 변경하려는 계산 로직 중 하나를 변경한다. + 반환 값에 부가 정보를 덧붙이도록 수정한다.


```jsx
const rawReading = acquireReading(); // 원본값
const aReading = enrichReading(rawReading); // 원본값 깊은 복사해서 받아옴
const basicChargeAmount = calculateBaseCharge(aReading);
```
<br>

#### 단계 3. 예전 만들어둔 함수를 변환함수로 옮긴다.

위에서 `calculateBaseCharge`를 변환함수근처로 옮긴다.

```jsx
function enrichReading(original) {
  const result = _.cloneDeep(original);
  result.baseCharge = calculateBaseCharge(result); // 여기로 이미 만들어져 있던 함수를 옮기자.
  return result;
}
```
<br>

#### 단계 4. 이 함수를 사용하던 클라이언트가 부가 정보를 담은 필드를 사용하도록 변경한다.

```jsx
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const basicChargeAmount = aReading.baseCharge; // aReading으로 return 되는 값에서 사용가능
```

<Br>

작성하다보면 반환하는게 정말 맞는지 궁금할때가 있다. 이럴때 테스트 코드로 확인할 수 있도록 작성하자.

#### 단계 5. 테스트코드 작성하기(불변성 검사)

```jsx
it("check reading unchanged", () => {
  const baseReading = { customer: "ivan", quantity: 15, month: 5, year: 2021 };
  const oracle = _.cloneDeep(baseReading);
  enrichReading(baseReading);
  assert.deepEqual(baseReading, oracle);
});
```
---

<br>

###  예전 함수를 사용하는 함수들도 바꾸어주기 

여기에서는 위에서 말했던  세금 계산하는 클라이언트를 바꾼다.

#### 단계 1. 일단 밀어넣기

일단 만들어둔 변환함수를 밀어놓고 본다.
```jsx
const rawReading = acquireReading();
const aReading = enrichReading(rawReading); // 일단 넣는다.
const base = aReading.baseCharge;
const taxableCharge = Math.max(0, base - taxThreshold(aReading.customer));
```
<br/>

#### 단계 2. 문제가 없다면 base 변수를 인라인해버린다.

```jsx
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const taxableCharge = Math.max(0, aReading.baseCharge - taxThreshold(aReading.customer));
```
<br>

#### 단계 3. 변환함수에 세금계산하는 함수를 옮긴다.

마찬가지로 세금계산하는 부분도 복잡하므로 변환함수에 넣어버리는 것이다.

```jsx
function enrichReading(original) {
  const result = _.cloneDeep(original);
  result.baseCharge = calculateBaseCharge(result);
  result.taxableCharge = Math.max(
    0,
    result.baseCharge - taxThreshold(result.customer)
  );
  return result;
}
```

#### 단계 4. tax를 계산하는 원본함수를 수정한다.

```jsx
const rawReading = acquireReading();
const aReading = enrichReading(rawReading);
const taxableCharge = aReading.taxableCharge;
```


이렇게 하게 되면 복잡한 로직들은 전부 하나의 변환함수 안에 감출 수 있다.
덤으로 세금을 계산하는 연관 로직들이 많아지게 된다면 그 변환함수 내에서 처리하도록 변경이 가능하다.

이렇게 되면 코드를 읽는 우리들은 이 값이 계산하는 건지, 그냥 반환만 하는 값인지 모르게 되는데. 리팩토링 기법에서는 이 방법이 바람직하다고 보며 추구하고 있다. 