---
title: react 웹에서 iphone 스타일 Time picker 사용하기(react-mobile-picker)
date: "2020-10-26"
template: "post"
draft: true
slug: "/posts/react/mobile-picker"
category: "programming"
tags:
  - "react time picker"
  - "react mobile picker"
  - "iphone 스타일 time picker"
  - " "
description: react 웹 Time picker
---

## react-time picker

react-time-picker는 상당히 유명하다.
들어가보면 깔끔하게 잘 정리된 사이트로 유료 라이선스로 제공한다.

다행히도 Time picker와 같은 몇몇 코드들은 가져다가 사용할 수 있다.

하지만 내가 만들어야 했던 방법은 input을 눌렀을때 Modal이 생겨서 나타나는게 아니라 inline-style 컴포넌트로 내장해야 했기 때문에 다른 방식을 찾아야 했다.

그런데 아이폰 스타일 Time picker가 React native에는 있는데 웹에서는 없는 것이다.

하는 수 없이 찾기를 포기하고

'아 그냥 직접 구현해야지' 하고 만들기 시작했는데 다행히 팀원분이 나에게 맞는 라이브러리를 찾아주셨다.

꽤나 단순한 라이브러리로 대충 코드를 뜯어봐도 특별할 게 없고 가볍다. 딱 내가 원하는 정도였고 내가 만들었어도 이런 비슷한 스타일로 만들었을 것이다.

##
