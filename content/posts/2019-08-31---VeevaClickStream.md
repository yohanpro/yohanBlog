---
title: Veeva ClickStream Class 만들기
date: "2019-08-31"
template: "post"
draft: false
slug: "/posts/js/Veeva_ClickStream"
category: "js"
tags:
  - "js"
  - "javascript"
  - "업무"
  - "Class"
  - "ClickStream"
description: "Veeva ClickStream 클래스 만들기"
---

ClickStream Github 저장소 ↓<br>
[yohanpro CLM boilerplate](https://github.com/yohanpro/Veeva-ClickStream)

## ClickStream이란?

Veeva에는 ClickStream이라는게 있다. 사용자가 화면을 터치나 혹은 정보를 보내는 행위를 했을 때,<br> 그 행위에 대한 데이터를 수집하는 기술이다.<br>
나는 ClickStream이라는 말이 Veeva에서만 사용하는 걸로 알았는데, 여기저기서 ClickStream이라는 용어는 사용되고 있었다.
그러니까 Clickstream이라는 말이 Veeva에서만 쓰이는 모양은 아닌가보다.<br>

아무튼 우리회사에서는 에이전시이고 클릭하는 모든 데이터들을 다 수집해 주기에는 시간상 제약이 있어서 제약회사의 요청이 있을때에만 (계약에 들어갈 때만) ClickStream을 붙여서 주고 있다.<br>
하지만 점점 이러한 데이터들을 수집하고 싶은 클라이언트들이 늘어났고, 요청이 많아짐에 코드를 그때마다 계속 다시 만들어야 하는 번거로운 일이 생겼다. 하지만 이건 누구나 알다시피 참 **귀찮고 번거로운 일**이다.

이번 기회에 번거로운 작업을 줄이고자 ClickStream Class를 만들게 되었는데, 뭔가 좀 어설프고 예쁘게 짜여지지않은 것 같다.
예전에 만들었던 CLM 자동생성 프로젝트도 만들고나니 문제점이 계속 보여 수정하고 있는데, 이 Class도 계속 지속적으로 업데이트를 해야할 필요성을 느낀다.<br>

## 본격적으로 만들기 전

필요 요구사항들을 정리하는게 우선이었다.
Veeva에서 Clickstream을 만드려면 다음과 같은 작업이 필요하다.

1. 객체 생성
2. 객체에 Call ClickStream 명세에 맞춘 데이터 삽입
3. Veeva API를 사용하여 데이터 전송(<span class="color--red">동기적으로 전송 필요</span>)

사실 엄청 간단한 작업처럼 보인다. 그리고 아마 나보다 더 훌륭한 프로그래머들은 금방 더 효율적으로 만들 수도 있겠다.<small>(나에게 좀 더 효율적인 방법을 알려줘..)</small>

### 동기적으로 데이터 전송

문제는 데이터에 전송을 하는 부분인데, 배열로 만들어서
<u>for문으로 한꺼번에 데이터를 보내려고 하면 들어가지 않는다.</u>
순차적으로 데이터를 보내야 하며, 즉 동기적으로 데이터를 보내는 방법이 필요하다.<br>

동기적으로 데이터를 보내려면 우선 생각나는게 `Promise`, `Async Await`를 활용한 방법과, `Queue`를 활용하여 보내는 방법이 있다.
큐를 활용하여 보내기엔 너무 코드가 많아지고, 또 해본적은 없기에.. Async Await를 활용하여 보내기로 하였다.

### Veeva library 데이터 전송 라이브러리

[Veeva CRM API Library](https://developer.veevacrm.com/api/CLMLibrary/)를 보면 만드는 예시가 나와있다. 이걸 그대로 따라하면 된다.

```js
function createExampleRecord() {
  var newRecord = {};
  newRecord.Number_Field_1__c = 42;
  newRecord.String_Field_1__c = "testing";
  com.veeva.clm.createRecord("Custom_Object__c", newRecord, callback);
}
function callback(result) {}
```

그리고 CreateRecord에 들어가는 Object API Name은 Salesforce에서 확인할 수 있다. 나는 들어갈 수 있는 타입도 확인할 수 있으니 보고 참고해서 잘 넣어주면 된다.
나는 Clicstream을 사용해야하기 때문에 `Call_Clickstream_vod__c`를 사용해서 createRecord 하면 된다.
<br>
<img style="margin-top:1em; width:70%;" src="/media/images/veeva/SalesforceData.png" alt="이미지"/>
