---
title: Vue에서는 eslint와 prettier를 동시에 사용하면 생기는 오류
date: "2021-09-05"
template: "post"
draft: false
slug: "/posts/programming/vue-eslint"
category: "vue"
tags:
  - "eslint"
  - "prettier"
  - "vue"
description: Vue 프로젝트를 쓸때는 eslint만 사용하자..
---

지금 만들고 있는 토이프로젝트 하고 있는데 이게 점점 더 커져서 옮기기 힘들기 전에 내 개인 프로젝트 Front 를 Nuxt + typescirpt로 이주하려고 삽질좀 했다.

결론부터 말하면 나는 타입스크립트를 쓰지 않기로 했다. Vue2에서 Typescript 쓰려고 오류잡는 시간이 너무 크다고 판단했다. 다음에 Vue3가 안정화 되면 그때 다시 토이프로젝트로 가려고 한다.

각설하고 Vue 코드를 작성할 때 자꾸 formmatting 문제가 나를 괴롭게 하는 것이었다.

> **문제:** Nuxtjs+ eslint+ prettier를 create-nuxt-app으로 설치햇음에도 불구하고 인덴팅이 제대로 되지 않음

<br>
  <p style="font-size: 1.8rem; font-weight:bold;">TL,DR;</p>
<div style="background-color: rgba(0, 0, 0, 0.1); padding: 1rem; font-size: 1.2rem;">
    <ul>
      <li> 1. create-nuxt-app으로 설치시 eslint만 설치한다, .eslintrc에 있는 extends에 prettier를 제거한다.</li>
      <li> 2. style tag 안에 있는 css들은 자동 formatting 문제는 해결 못했다. </li>
      <li> 3. css들을 전부다 작성하고 난 뒤 shift+option+f로 포매팅한다.</li>
    </ul>
</div>

이상하게도 하지만 기타 다른 Vue 프로젝트를 했을 때 이정도의 문제는 일어나지 않았다.

prettier와 eslintrc에 대한 이해도가 많이 없는 상황에서 그냥 쓰려고 하니 발생한 문제들이엇다.



npx create-nuxt-app으로 만들면 이렇게 템플릿이 나온다. (eslint, prettier) 적용

여기서 eslintrc는 이렇게 default로만 되어 있을 것이다.

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    "prettier",
  ],
  plugins: [],
  // add your custom rules here
  rules: {},
};
```

그리고 vue를 좀 써본 사람들이라면 당연히 settings.json에서 아래 정도의 세팅은 해놨으리라고 생각한다.

```js
"editor.formatOnSave": false,
    "editor.codeActionsOnSave": [
        "source.formatDocument",
        "source.fixAll.eslint"
    ],
```

eslint와 prettier가 충돌을 일으키기 때문인데 에디터의 default formatsave를 제거하고 lint로만 해주는 것이다.

이렇게 해놓고 linting 테스트를 하면 먹지 않는다. 난감 ;;;

여기서 nuxt.config.js에서 prettier를 적용하지 않기로 하면 문제가 해결된다.

즉 아예 npx로 설치할때 prettier를 체크하지 않고 Eslint만 체크했으면 됬을텐데 두 개 다 사용해야 하는 줄 알고 삽질을 이렇게 했던 것이다.


```js
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:nuxt/recommended",
    // "prettier", <- 요놈을 제거
  ],
```
아무튼 이렇게 prettier를 제거함으로서 문제는 사라지긴 했다.

그럼 style 태그 안에 있는 css들은 어떻게 formatting을 해주어야 하는가?

결론부터 말하면 고치지 못했다. vue파일에 `defaultFormatter`를 `octref.vetur`로 주고 

shift+opition+f를 눌러서 포맷한다. 이때 vetur에 맞게 js 파일들이 linting 될때도 있는데 어차피 다시 eslint fix 룰에 의해서 다시 원복된다.

```json
 "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
```