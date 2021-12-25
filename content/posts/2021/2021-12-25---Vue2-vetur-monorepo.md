---
title: Vue2 Vetur typescript 불편한 점과 monorepo 적용
date: "2021-12-25"
template: "post"
draft: false
slug: "/posts/vue2/vue2-vetur-monorepo"
category: "vue"
tags:
  - "Vue2"
  - "Vetur"
  - "monorepo"
  - "leran"
  - "vetur.config.js"
description: Vue2와 Typescript, Vetur monorepo 적용
---

Vetur에서 `tsconfig설정` 같은게 잘 먹지 않는데. 이를 해결하는게 굉장히 필요하다. 

Vue2를 쓰고 있다면 `Vetur`를 사용해야하고 Vue3를 사용한다면 Vue에서 공식 제공하는 `Volar`를 쓰는걸 추천하고 있다.<br/>
확장라이브러리의 경우 Vue2를 쓰고 있다면 `Vetur`를 사용해야하고 Vue3를 사용한다면 Vue에서 공식 제공하는 `Volar`를 써야한다.

#### 현 시점(2021. 12월) Vue에서 아쉬운 점
<br>


##### Vue3는 2020년 9월 경에 릴리즈 되었다. Vue-CLI로 설치할 때 Experimental로 뜬다. 이 하나만으로도 실무를 할때 도입하기가 꺼려진다. 

<br>

##### 그렇다고 Vue2를 그대로 사용하자니 Typescript 안정화가 덜 되어 있다.
  - vue-shim.d.ts 파일을 작성해야 하는 등, 타입 추론에 추가 설정이 필요함(non zero config)
  - Class형 컴포넌트와 (데코레이터를 사용) `Vue.extend`를 사용하는 방식 (Typescript)이 나누어져 있기 때문에. Vue 예제를 찾을 때 혼선이 발생한다.

##### 확장 라이브러리의 설치가 거의 강제된다.  
-  Vue의 경우 `.vue`라는 확장자를 사용해야 하며, 개발시 `eslint` 적용을 위하여 `Vetur`같은 라이브러리가 필요하다.
문서는 잘 되어 있지만, Support  이슈를 하나하나 찾아서 해결해야 한다.


즉 이제 2021년을 넘어 2022, 2023년에 Vue3가 안정화되어 실무 레벨에서도 Vue3를 사용한다고 해보자. 
컴포넌트를 구현한다거나, 어떤 오류가 나서 예제를 찾고 있는데 다음과 같은 **끔찍한 상황이 발생할 수 있다.**

<div style="font-weight:600;border-radius:12px; background-color: rgba(223,201,212, 0.2); padding: 1rem; margin-bottom: 1rem;">

- Vue2에서 js만 사용한 경우
- Vue2에서 `Vue.extend`를 사용해서 TS를 사용한 경우
- Vue2에서 데코레이터로 TS를 사용한 경우
- Vue3에서 js만 사용한 경우
- Vue3에서 `DefineComponent`를 사용하여 TS를 사용한 경우

</div>

이를 감당할수 없어서 나는 React로 도망쳐야 할지도 모르겠다. ~~(React가 짱이다.)~~

## Vue2 모노레포 Vetur config

일단 현 Vue2로 만든 Typescript 설정관련 문제점을 보자

- 루트에 있는 `tsconifg.json`를 extends로 가져오고 싶은데 가져올수가 없다.
- path alias를 사용해서 컨트롤하고 싶은데 이게 제대로 가져오지 못한다.

[vetur.config.js | Vetur](https://vuejs.github.io/vetur/reference/#example)

일단 이 두 문제가 있는데 Vetur로 설정을 하려면 루트에 tsconfig나 jsconfig파일이 없어야 한다는 전제가 있다. 

따라서 일단 루트에 있는 tsconfig를 가져오는건 불가능한듯 싶다. 


> 📔 If you use a monorepo, VTI or `package.json` and `tsconfig.json/jsconfig.json` does not exist at project root, you can use `vetur.config.js` for advanced settings.



여기서 VTI란 짧게 설명하고 넘어가면 Vetur Terminal Interface인데, Vue template에서 `.vue, script=”ts”` 에서 나타나는 오류를  잡기 위해서 나왔다.  

Vue2  monorepo 관리툴인 `lerna.js`를 사용하였는데. 
파일 구조는 아래와 같다.



<div>

<img width="50%" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211225/screen.png">
</div>

<Br/>

이제 여기서 monorepo 루트에 `vetur.config.js`을 생성해준다. [여기](https://vuejs.github.io/vetur/reference/#example)를 참고하자

```js
// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  projects: [
    './packages/front', // Shorthand for specifying only the project root location
    './packages/admin',
  ],
}
```

세부로 projects 아래에  tsconifg 파일이나, package.json의 경로를 지정해줄수 있다.

```js
projects: [
    './packages/repo2', // shorthand for only root.
    {
      // **required**
      // Where is your project?
      // It is relative to `vetur.config.js`.
      root: './packages/repo1',
      // **optional** default: `'package.json'`
      // Where is `package.json` in the project?
      // We use it to determine the version of vue.
      // It is relative to root property.
      package: './package.json',
      // **optional**
      // Where is TypeScript config file in the project?
      // It is relative to root property.
      tsconfig: './tsconfig.json',
      // **optional** default: `'./.vscode/vetur/snippets'`
      // Where is vetur custom snippets folders?
      snippetFolder: './.vscode/vetur/snippets',
      // **optional** default: `[]`
      // Register globally Vue component glob.
      // If you set it, you can get completion by that components.
      // It is relative to root property.
      // Notice: It won't actually do it. You need to use `require.context` or `Vue.component`
      globalComponents: [
        './src/components/**/*.vue'
      ]
    }
  ]
```

여기서 주의해야 할 점은 `root`만 **monorepo 루트에 있는 `vetur.config.js`의 상대경로이고** 나머지는 해당 **프로젝트 루트의 상대경로**라는 것이다. 

그럼 이제 각 packages안에 있는 각각의 프로젝트에서 각 tsconifg.json에 대한 path alias를 사용할 수 있다. 

```json
// packages/admin/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": [
        "./components/*"
      ],
    }
  },
}
```
<br>

 ### path alias 사용
 <br>

```typescript
// packages/admin/components/login/index.vue

<script lang="ts">
import Vue from 'vue'
import BaseDialog from '@/components/common/dialog/BaseDialog.vue' //path alias

export default Vue.extend({
  name: 'Login',
  components: {
    BaseDialog,
  },
  data: () => ({
    id: '',
</script>
```
