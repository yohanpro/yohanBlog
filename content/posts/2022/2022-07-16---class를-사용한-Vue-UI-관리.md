---
title: Class를 사용한 Vue UI 관리
date: "2022-07-17"
template: "post"
draft: false
slug: "/posts/vue/class를-사용한-vue-ui-관리"
category: "vue"
tags:
  - "클래스를 사용하여 Vue UI 관리해보기"
  - "Vue3"
  - "context"
  - "관심사 분리"
  - "응집도 높이기"
description: "클래스를 사용하여 UI를 깔끔하게 관리해보자."
---

## Class를 사용한 Vue UI 관리


Vue UI를 관리함에 있어 복잡한 부분이 몇가지 있다.

관련도가 높은 코드를 한곳에 뭉쳐 응집도를 높이고자  Vue3에서 setup API가 나왔지만,  여전히 다루는 로직이 커지고, 한 페이지에서 state를 다루는 동작이 복잡해질 경우 코드들이 한 곳에서 이곳 저곳 쓰이게 되면서 많이 헷갈리게 되기 마련이다. 이는 Vue뿐만이 아니라 React도 마찬가지이다. 

중구난방으로 쓰이고 있는 이 코드뭉치들은 보물찾기 하는 것처럼 여기저기 흩어지게 되어 어디에 연관된 로직인지 이해하기 힘들어지는 순간이 온다. 

특히나 일정이 급박하게 돌아갈 경우 더더욱 스파게티처럼 꼬이게 되어 거대한 덩어리가 되어버린다.

구조는 아래 웹사이트를 많이 참고했고 내 입맛에 맞게 어느정도 변형을 하였다. 

### 참고 사이트 

[Vue Application Architecture - UI, 마치며 (Part5)](https://genie-youn.github.io/journal/Vue_Application_Architecture_part5.html)

## UI와 State를 다루는 로직 분리

서비스가 점점 더 커질 것을 예상한다면 이에 맞는 코드베이스의 분리가 필요하다. 그리고 디렉토리 구조 약속을 잘 해놓는다면, 나뿐만이 아니라 다른사람이 수정할때에도 이에 맞게끔 확장이 가능하다. 지금 사용하고 있는 구조를 소개한다. 

![screenshots 6.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20220716/screenshots+6.png)

### URL 엔드포인트에 따른 분리

Nuxt.js를 많이 쓰다보니 page에 들어있는 폴더들을 엔드포인트로 정리하는 걸 습관적으로 하게되었다.

사실 깔끔하지 않은 것은 사실이다. 저 구조를 Nuxt로 그대로 옮기게 되면 `studio/my-voice/componet`라는 엔드포인트가 생기게 되므로 엄밀히 보면 맞지는 않다.  또한 url의 라우팅이 점점 복잡해 질 경우 네스팅이 중첩으로 들어가게 되어 보기 힘들어지는 단점이 있다. 

하지만 이 모든 것을 약속으로 정해놓게 되면 무리없이 찾을 수 있고, 수정도 어렵지 않다.

### 특징

- page안에는 각 엔드포인트별로 폴더가 정리되어 있다.
- 각 엔드포인트에는 최상위 page의 UI를 담아내는 용도로 Container가 존재한다.
- 각 엔드포인트의 Container에는 State로직을 분리해낸 Context가 존재한다.  (각 엔드포인트 기준으로 Container는 한개이지만 Context는 여러개 존재할 수도 있다)
- 각 엔드포인트 component에는 Container안에 렌더링이 될 component들이 존재한다.
- class는 Container의 로직이 단순할 경우에는 Context안에 포함될수도 있고, 별도로 뺄 수있다.

### 간단한 로직에서 Context 작성과 사용

- Context를 작성할 수 있는데 복잡하지 않을 경우에는 아래와 같이 작성하면 된다.

```tsx
import { ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { getFollow } from "@api/follow-service";

const follow = ref({});
const user = ref({});

function setFollow(follow) {
  follow.value = follow;
}

function setUser(newUser) {
  user.value = newUser;
}

async function startContext() {
  const follow = await getFollow();
  follow.value = follow;
  user.value = follow.user;
}

function endContext() {
  follow.value = null;
  user.value = null;
}

export function usePageAContainerContext() {
  onBeforeRouteLeave(() => {
    endContext();
  });

  return {
    startContext,
    follow,
    setFollow,
    user,
    setUser,
  };
}
```

그리고 사용시에는 Container안에서 사용해주면 된다. 

```html
<script setup>
import { usePageAContainerContext } from "@/components/usePageAContainerContext";

const { user, setUser } = usePageAContainerContext();
</script>
<template>
  <div>
    <div></div>
    <button @click="setUser({name: 'newUser'})"></button>
  </div>
</template>
```

여기까지는 간단하지만, 만약 로직이 복잡해질 경우이다. 피해갈 수 없으며 , 중구난방으로 짜게 될 경우가 생긴다. 

### Context 내에서 Class 분리

요즘 많이 하고 있는 방법은 Class로 분리하고 인스턴스화하여 이를 `Ref`로 감싸서 처리하는 것이다. 

```tsx
/* useMyProjectContext */

class MyProject {
  private _genere: string;
  private _title: string;
  constructor() {
    this._genere = "";
    this._title = "";
  }
  get genre() {
    return this._genere;
  }
  set genre(value: string) {
    this._genere = value;
  }
  get title() {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }
}
const myProject = ref(new MyProject());

interface MyProjectContext {
  startContext: () => void;
  myProject: Ref<{
    genre: string;
    title: string;
  }>;
}
const useMyProjectContext = (): IMyProjectContext => {
  onBeforeRouteLeave(() => {
    endContext();
  });
  return {
    startContext,
    myProject,
  };
};
```

```html
/* MyProjectContainer */

<script lang="ts">
import { defineComponent } from "vue";
import useMyProjectContext from "./myProjectContext";

export default defineComponent({
  name: "MyProjectContainer",
  setup() {
    const { myProject } = useMyProjectContext();
    return {
      myProject,
    };
  },
});
</script>

<template>
  <div>
    <button @click="myProject.genre = 'romance'"></button>
  </div>
</template>

```

**Pros**

- `MyClass.getUser()` 와 같은 방법으로 사용할 수 있으니 어떤 로직인지 알기 쉬워지고 이로 인해 관심사 분리가 확실해진다.
- Unit 테스팅 경험이 좋아진다. 인스턴스를 주입하여 독립적으로 테스팅이 가능하다.
- 재사용성이 용이하다. class로 분리해두면 따로 떼어다가 사용이 가능하고, 수정도 쉬워진다.

**Cons**

- Class내 로직이 복잡해지고 분리해야할 신호가 왔을때 분리가 어렵다.
- 반응성(Reactivity)를 관리하기 어렵다.
- Class typing을 일일이 명기해줘야 하고 자칫 파일이 너무 커질 수 있다.
- class로 관리하는 것이 프론트엔드 개발자에게는 익숙하지 않아 문법의 이해가 필요하다.


---
### 실 사용 예시
```ts
import { TrainingScript } from "@/api/studio/voice";

export const RECORDING_TOTAL_STEP = 10;
export enum RecordState {
  Ready = "ready",
  Recording = "recording",
  Stop = "stop",
  Pause = "Pause",
  Playing = "playing",
}

export class VoiceRecording {
  private _step: number;
  private _recordState: RecordState;
  private _voiceRecords: File[];
  private _recordSentences: TrainingScript[];
  private _voiceName: string;
  constructor() {
    this._step = 1;
    this._recordState = RecordState.Ready;
    this._voiceRecords = [];
    this._recordSentences = [];
    this._voiceName = "";
  }
  get step(): number {
    return this._step;
  }
  set step(step: number) {
    this._step = step;
  }
  get isLastStep(): boolean {
    return this._step === RECORDING_TOTAL_STEP;
  }
  get recordState(): RecordState {
    return this._recordState;
  }
  set recordState(recordState: RecordState) {
    this._recordState = recordState;
  }
  get currentSentenceId(): string {
    return this._recordSentences[this._step - 1].id;
  }
  get currentSentence(): string {
    return this._recordSentences[this._step - 1].content;
  }
  get nextSentence(): string {
    if (this.isLastStep) return "-";
    return this._recordSentences[this._step].content;
  }
  set recordSentence(data: TrainingScript[]) {
    this._recordSentences = data;
  }
  addVoiceRecordArray(file: File): void {
    this._voiceRecords.push(file);
  }
  resetVoiceRecordArray(): void {
    this._voiceRecords = [];
  }
  get voiceRecords(): File[] {
    return this._voiceRecords;
  }
  get voiceName(): string {
    return this._voiceName;
  }
  set voiceName(name: string) {
    this._voiceName = name;
  }
}

```
<br>

## 추후 리팩토링 과제

하지만 이렇게 뭉쳐놓는다고 하더라도 결국엔 리팩토링을 해야할 일이 생긴다.  마틴 파울러 리팩토링 7.5장에 따르면 
- **일부 데이터와 메소드를 따로 묶을 수 있다면 분리하라는 신호이다.**
- 함께 변경되는 일이 많거나 서로 의존하는 데이터들은 각자  분리한다.
- 특정 데이터나 메소드 일부를 제거하면 어떤일이 일어나는지 자문해보면 좋다.
- 제거해도 다른 필드나 메소드들이 논리적으로 문제가 없다면 분리할 수 있다는 뜻이다.

즉 위에서는 목소리 녹음이라는 내용으로 VocieRecording을 하나로 뭉쳤지만, 위의 메소드가 너무 많아 질 경우에는 분리해야한다.


위에서는 `recordState`를  뺄 수 있는데 이렇게 되면 Vue Reactivity를 잃어버릴 가능성이 있어서 관리하기가 어려워진다.

```ts
export class VoiceRecording {
  /** 기타 생략 */
  private _recordState: RecordState;

  constructor() {
    this._recordState = new RecordState()
  }


class RecordState {
  get recordState(): RecordState {
    return this._recordState;
  }
  set recordState(recordState: RecordState) {
    this._recordState = recordState;
  }
}
```

지금은 이 상황을 알면서도 단일 Ref로 감싸서 단일 Class로 처리하고 있다.
이를 해결하기 위해서는 각각의 클래스를 다시 ref로 감싸서 처리할 수 있을 것이다. 하지만 역시 Typescirpt를 작성하는 시간이 많이 들게 되므로 이를 고려해야 한다.
