---
title: ESLint와 Prettier에 대해 알아보자.
date: "2020-04-24"
template: "post"
draft: false
slug: "/posts/code/eslint"
category: "code"
tags:
  - "eslint"
  - "prettier"
  - "eslintrc"
  - "prettierc"
  - "코드를 예쁘게"
  - "vscode"
  - "eslint 설정법"
description: Prettier와 Eslint를 사용하여 Vscode 작업환경을 설정해보자.
---

이 글은 내가 추후에 다시 Setting을 할 때 다시 찾아볼 수 있도록 작성한 글이며, 다른 웹사이트에서도 이것저것 추천하는 것을 짜깁기하였습니다.

## ESLint와 Prettier를 사용하는 이유

Eslint와 Prettier는 너무 유명해서 어떤 것인지 굳이 설명할 필요는 없을지도 모른다. 이런 extension들은 코드를 예쁘고 회사가 정한 스타일에 맞게끔 자동으로 변경해주는 도구이다. 다른 말로는 Formatter라고 한다. 나는 Vscode를 사용하기 때문에 마켓플레이스에서 설치해서 사용할 수 있지만, 직접 npm이나 yarn을 이용해서 설치할 수도 있다.

회사가 커지고 개발자가 많아지게 되면 각자 자신이 좋아하는 스타일대로 코드를 작성하게 되는데, 여러 사람이 같이 만들게 되는 프로젝트의 경우는 이런 설정을 통일해 주는 것이 필요하다.<br>

<em><strong>" 이건 사람마다 다 주관적이라서 자신이 원하는 대로 쓰면 돼!"</strong></em> 라고 할 사람도 있겠지만,<Br>

아무리 그래도 보편적으로 사람이 읽기 쉽고, 관리하기 쉬운 코드 형식은 분명히 존재한다.

그래서 많은 프로젝트들은 가이드들을 강제하고 있다. 그리그 이걸 관리해주는 도구들은 여러가지가 있다.
JSHint, JSLint 같은 도구들도 있지만 ESLint가 거의 짱먹고 있다고 보면 된다.

## ESLint와 Prettier

개발자들이 많이 사용하는 포맷터 도구 중 ESLint와 Prettier는 어떻게 다른 것일까?

. <strong style="font-size:1.3em;">ESLint</strong> : 코드에서 문법적이거나 논리적으로 규칙을 따르지 않을때 밑줄을 그어준다. 이는 스크립트를 실행해서 간단한 오류 정도는 고칠 수 있다.(예를 들면 선언을 했는데 쓰지 않는 변수라던가...)<br>
. <strong style="font-size:1.3em;">Prettier</strong> : 논리적인 코드는 고치지 않는다. 오직 포맷팅만 해준다. (ex. 필요없는 공백 제거, 작은 따옴표를 큰 따옴표로 바꾸어 준다던가...)

그런데 사실 둘 다 하는 일은 거의 비슷하다고 볼 수도 있다. 그리고 두 개를 동시에 쓸 경우 충돌이 일어날 수도 있다. 그럴 경우에는

```bash
$ npm i --save-dev eslint-config-prettier eslint-plugin-prettier
```

를 해주고 `.eslintrc` 파일에 다음과 같이 추가를 해주자.

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  }
}
```

이렇게 설정해놓으면 javascript는 Eslint만 담당하고, 코드 포맷팅은 Prettier가 담당하게 된다.

<br>

## Prettier 적용방법

방법은 총 세 가지다.

1. .prettierrc 설정 파일
2. VsCode 전역 플러그인 설치
3. Prettier를 npm 으로 설치해서 CLI 사용

나의 경우에는 Vscode 마켓플레이스에서 다운받아 전역으로 설정해 놓고 있다.
기본 포맷터 설정의 경우 아래와 같이 설정하면 기본으로 할 수 있다.

```json
// settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Airbnb ESlint 설정방법

AirBnb 스타일 가이드는 어디를 가도 인기가 많다. Prettier에 맞춰 eslint를 일일이 규칙을 추가하기에는 참 번거롭기 때문에 그냥 AirBnb 스타일로 플러그인을 맞춰버리는 것도 좋은 방법이다.

```bash
$ npx install-peerdeps --dev eslint-config-airbnb
```

그리고 그 후에 `.eslintrc.json`파일에 다음과 같이 넣어준다.

```json
{
  "extends": ["airbnb", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error"]
  }
}
```
