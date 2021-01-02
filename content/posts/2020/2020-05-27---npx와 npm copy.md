---
title: npx와 npm 차이
date: "2020-06-01"
template: "post"
draft: false
slug: "/posts/npm-npx"
category: "npm"
tags:
  - "npx와 npm"
  - "deno"
  - "npx와 npm의 차이 "
description: npm과 npx의 차이는 무엇일까?
---

언제부턴가 npm 대신 npx가 눈에 더 자주 띈다. `create-react-app`이 그 예시이다.
npx 역시 npm팀이 만든 것이고 npm@5.2버전 부터는 자동으로 npx를 사용할 수 있다.

아무튼 `create-react-app`을 사용할 때 npx를 사용하긴 했는데 도대체 이게 왜 필요한지 잘 느끼지 못했다. 도대체 이 녀석은 무슨 역할을 하는 것이고 왜 필요한 것일까?

## npx

생각해보면 우리가 `create-react-app`을 굳이 내 컴퓨터 하드에 저장할 필요는 없다.
이렇게 무거운 모듈은 가끔 프로젝트 하나를 생성하고 싶을 때만 사용하고 싶을 것이다.

포크레인은 집을 지을때만 필요하지 굳이 내 집에 들여놓을 필요는 없다. 나는 원할 때 포크레인을 부르기만 하면 되고 포크레인을 만든 팀에서는 포크레인에 문제가 있으면 고쳐놓고 기름칠을 잘 해둔다. 따라서 나는 걱정없이 최신 포크레인만 사용하면 된다.

## 로컬로 설치된 도구를 npm run scripts 없이 사용하자.

`mocha, grunt,jest`같은 도구들은 개발할 때만 필요한 npm 라이브러리 들이다.
npm과 npx에 대해 설명하고 있는 다른 블로그들을 읽어봐도 보통 `mocha`를 예시로 드는 것 같다.

아무튼 우리가 보통 `mocha`와 같은 테스팅 도구를 실행하려면 보통 `package.json`의 scripts 부분에 다음과 같이 실행 명령어를 등록시켜 놔야 한다.

이렇게 말이다.

```json
"test": "jest --config ./jest/jest-config.js",
"test:coverage": "jest --coverage --config ./jest/jest-config.js",
"test:watch": "jest --watch --config ./jest/jest-config.js",
```

그런데 npx는 굳이 이렇게 `package.json`에 등록시켜 놓지 않아도 된다.
그냥 이렇게 명령어를 실행하면 된다.

```bash
$ npx jest
```

<Br>

## 내가 만든 프로젝트도?

내가 예전에 만든 npm 패키지가 있다.`create-veeva-project`인데 이것도 global로 설치를 해서 cli로 프로젝트를 만들어준다. 나와 내 팀만 이용하는 것 같지만 그래도 weekly download가 10은 나온다. 그렇다면 마찬가지로 이걸 사용하고 싶으면

그냥 `npx create-veeva-project`를 사용하면 된다. 만약 없으면 최신 버전에 해당하는 패키지를 설치하여 실행하고, 실행된 이후에는 해당 패키지를 제거할 것이다.
