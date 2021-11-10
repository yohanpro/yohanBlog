---
title: Javascript의 스택사이즈
date: "2021-11-08"
template: "post"
draft: false
slug: "/posts/js/stack-size"
category: "javascript"
tags:
  - "js"
  - "stack size"
  - "Heap"
  - "js stack size"
description: Javascript의 스택사이즈는 얼마일까?
---
최근 실수로 vue 컴포넌트를 재귀호출하여 Maximum stacksize를 넘어서 프로세스가 종료되는 일이 있었다. 

아무튼 궁금하다 Javascript를 사용하는 입장에서 Stack 사이즈는 얼마나 될까? 하는 궁금증이다.

> 결론부터 말하면 nodejs라면 설정한 메모리에 따라 다르지만 브라우저의 경우는 <span style="color:red; font-weight:bold;">대략 1mb 언더이다.</span> 

브라우저 환경에서 count를 1씩 증가 시키다 보면 javascript stack 사이즈가 나오지 않을까? 

나만 그런 생각을 가진게 아니었나보다. 10년전 stackoverflow에도 똑같은 내용이 있었다.

[Browser Javascript Stack size limit](https://stackoverflow.com/questions/7826992/browser-javascript-stack-size-limit)

방법은 간단한 코드를 콘솔에서 돌려보면 된다. 

```jsx
var counter = 0;
try {
  function foo() {
    counter += 1;
    foo();
  }
  foo();
} catch(e) {
  console.error(e);
  console.log('counter =', counter);
}
```

![screen 7.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/screen+7.png)

13902가 나온다. vscode에서 실행한 nodejs는 15901이 나온다. 몇번을 돌려봐도 동일한 숫자가 나오는데, 재밌는건 크롬 51버전까지는 41753이었다. 어떤 변화가 있었는지는 모르겠지만 더 줄어들었다.

13902라는 이 숫자는 1 프레임당 몇 번 불려져왔는지를 나타내는 것이고 javascript에서 number, boolean등은 8byte를 할당받는다. 따라서 몇 mb인지는 약간의 수학을 하면 된다.

결과는 다른 블로거가 계산한것을 참고하더라도 대략적으로 1mb 언더인 모양이다. 

재귀호출을 실수로 여러번 하지 않는 이상 stack사이즈가 1mb를 넘기가 쉽지 않다. 따라서 vscode에서도 스택의 Size를 1mb로 기본 잡아놓는다. (윈도우 기준임. 맥에서는 확인하기 힘들다고 한다)

이 1mb를 넘어가게 되면 프로세스가 뻑나면서 종료가 된다.

