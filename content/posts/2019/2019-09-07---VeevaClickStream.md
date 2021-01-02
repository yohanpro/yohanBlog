---
title: Veeva ClickStream Class 만들기
date: "2019-09-07"
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

즉 만약에 한 개의 ClickStream 오브젝트를 보내고 싶다면 다음과 같이 보내면 된다.

```js
let clickStreamObj = {};
clickStreamObj.Question_vod__c = "당신의 이름은 무엇인가요?";
clickStreamObj.Track_Element_Description_vod__c = "이름 질문";
clickStreamObj.Answer_vod__c = "김요한";
clickStreamObj.Track_Element_Id_vod__c = 1;
clickStreamObj.Usage_Start_Time_vod__c = new Date();

com.veeva.clm.createRecord(
  "Call_Clickstream_vod__c",
  clickStreamObj
  function(result) {
    console.log(result);
  }
);
```

그런데 두 개 이상을 보내게 된다면 상당히 골치아플 것이다.<br>
위와 같이 두 번 해주어야 하고, 세 개를 보낸다면 3개를 만들어주어야 한다. 이런 경우는 Class를 만들어서 인스턴스를 생성할 수 있게 만들어 주는 편이 좋겠다고 생각을 했다. <br>

### ClickStream 클래스 작성

ClickStream 클래스에는 데이터를 보내는 메소드, 생성 메소드가 들어가야 한다. <br>
그리고 문제가 되는 것은 배열로 보낼 때 동기적으로 보내야 하므로 배열로 보낼 때는 따로 처리를 해주어야 한다고 생각했다.<small><s>사실 이게 맞는지는 잘 모르겠다.</s></small>

그래서 생겨난 ClickStream Class는 다음과 같다.

```js
class SurveyClickStream {
  /**
   * @param {String} qusetionTitle clicksteam에 들어갈 question
   * @param {String} description clicksteam에 들어갈 description
   * @param {String} answer answer
   * @param {String} id 고유값, update하기 위해 사용
   * @param {String} type 문제의 유형 text, picklist...
   * @param {String} action create or update
   */
  constructor(qusetionTitle, description, answer, id, action) {
    this.clickStreamObject = {};
    this.clickStreamObject.Question_vod__c = qusetionTitle; //서베이 질문
    this.clickStreamObject.Track_Element_Description_vod__c = description;
    this.clickStreamObject.Answer_vod__c = answer;
    this.clickStreamObject.Track_Element_Id_vod__c = id; //updateRecord에서 처리할 id
    this.clickStreamObject.Usage_Start_Time_vod__c = new Date();
    this.action = action;
  }
```

Constructor로 Title, description, answer, id, action을 넣어준다. <Br>
여기서 id는 만약 동일한 세션 내에서 사용한다면 update를 할 수 있다. <br>
아니면 Veeva API 중에 `queryRecord`라고 하는 Api가 있으므로 내가 보낸 call ClickStream을 받아올 수도 있다.

```js
  submitSurveyResult() {
    return new Promise((res, rej) => {
      let result = "";
      if (this.isAnswerEmpty(this.clickStreamObject.Answer_vod__c)) {
        result = "답변 없음";
        return setTimeout(() => {}, 500); //만약 답변이 비어있다면 그대로 return 해준다.
      }
      if (!isVeevaEnvironment()) {
        //개발환경이라면 여기서 내보내고 종료
        console.log(this.clickStreamObject);
        return res(result);
      }
      switch (this.action) {
        case "create":
          com.veeva.clm.createRecord(
            "Call_Clickstream_vod__c",
            this.clickStreamObject,
            function(result) {
              res(result);
            }
          );
          break;
        case "update":
          com.veeva.clm.updateRecord(
            "Call_Clickstream_vod__c",
            this.clickStreamObject.Track_Element_Id_vod__c,
            this.clickStreamObject,
            function(result) {
              res(result);
            }
          );
        default:
          result = "check your action ";
          return rej(result);
      }
    });
  }

  isAnswerEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  }

```

보낸 action에 따라 update를 하거나 create를 할 지 결정해서 Promise를 리턴해준다.<br>
그러나 내가 이 행동을 update 할 것인지, 혹은 create 할 것인지는 어떻게 결정할 것인가가 문제이다.<br>
일단 지난번에 만든 프로젝트에서는 sessionStorage를 활용해 현재 열린 프레젠테이션에 한해서만 update를 해주게 만들었었다.<br>
그러나 queryRecord API를 활용해 값이 있는지를 체크한 후 만드는 방법도 있을 것 같은데 이 부분은 좀 더 연구해 보아야 한다.

```js
const submitClickStream = async surveyArr => {
  try {
    for (let i = 0; i < surveyArr.length; i++) {
      await surveyArr[i].submitSurveyResult();
    }
  } catch (error) {
    console.log(error);
  }
};
```

ClickStream class에는 포함되어 있지는 않지만 만약에 배열로 보낸다면 이런 방식으로 데이터를 보내주어야 한다.<br>
배열로 만들어서 한꺼번에 보내려고 한다면 값이 들어가지 않기 때문에 Async await로 만들어주었다.
이제 인스턴스를 만들어서 활용하면 된다.

```js
const survey1 = new SurveyClickStream(
  "안녕하세요?",
  "인사",
  "Hi!",
  "survey1",
  "text",
  "create"
);

const survey2 = new SurveyClickStream(
  "오늘 날씨는 어떻습니까?",
  "오늘 날씨 질문",
  "Very good",
  "survey2",
  "text",
  "create"
);
const survey3 = new SurveyClickStream(
  "Number 선택",
  "Num",
  "3",
  "survey3",
  "picklist",
  "create"
);
const surveyArr = [survey1, survey2, survey3];

const submit = () => {
  submitClickStream(surveyArr);
};
```
