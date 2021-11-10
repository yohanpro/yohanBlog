---
title: Nuxt 레거시 프로젝트 Typescript 입히기
date: "2021-11-08"
template: "post"
draft: false
slug: "/posts/js/nuxt-ts"
category: "react"
tags:
  - "nuxt"
  - "Vue"
  - "Typescript"
  - "Nuxt+Ts"
description: 레거시 Nuxt 프로젝트에 Typescript를 입혀보자.
---
Vue 예전 프로젝트를 다시 사용하게 되었다. 거의 비슷한 프로젝트라서 그대로 만들어진 Vue를 재활용하는게 좋다. 
그런데 이 프로젝트에 Typescript를 도입한다면 디버깅 하기 쉽고, 개발단계에서 리팩토링하기도 쉬울수 있다. 

현재는 Nuxt 2.0.0 버전으로 만들어진 프로젝트인데 이게 오히려 순수 Vue로만 만들어졌다면 더 TS를 입히기 쉬웠을 것 같다. 

거두절미하고 어떻게 legacy Nuxt → ts Nuxt로 이주하게 되었는지 어떤 문제가 있었는지를 작성한다.
우선 인프런의 캡틴판교 Typescript 강의를 많이 참고하였고 Nuxt이기 때문에 나와는 맞지 않는 부분들은 
Nuxt typescript에서 권장하는 방식을 최대한 사용하려고 하였다. 

[Vue.js + TypeScript 완벽 가이드 - 인프런 | 강의](https://www.inflearn.com/course/vue-ts/dashboard)

이 글에서 다루려고 하는 것은 어떻게 Store에 있는 타입을 추론하는지, 기존에 있는 레거시 프로젝트에 TS를 입히는 과정에 대해서만 설명하려고 한다. 그리고 언제까지나 공식문서를 참조하는 것이 좋다. 지금 작성하는 시점에서 나의 해결방안이기 때문에 항상 공식문서에 들어가서 최신 소스로 만들자.

[Nuxt TypeScript](https://typescript.nuxtjs.org/)

특히 Store에 있는 파일 추론하는 것까지만 완성하면 나머지는 이제 별 어려운 일이 없기 때문에 Store에 신경을 썼다. 또한 Vue3의 꽃인 Composition API를 적용해보면서 적절히 리팩토링해볼 생각이다.

## Class API 미사용

많은 블로그에서 설명했던 방식인 데코레이터로 Class api를 사용하는 것을 사용하지 않았다. 2019년에 Evan you가 PR을 거절하면서 Vue는 앞으로 클래스 형식으로 가져가지 않을 것임을 설명했다.  

[[Abandoned] Class API proposal by yyx990803 · Pull Request #17 · vuejs/rfcs](https://github.com/vuejs/rfcs/pull/17#issuecomment-494242121)

그렇기 때문에 굳이 시간을 써서 class api를 배우려고 하지 않았다. 나와있는 내용들이 흥미롭다.

- Class Api 역시도 목적인 typescript를 지원하는데 있어 완벽하지 못함
- 내부구현을 복잡하게 만든다. 
- 로직 구성을 개선하지 않는다.(Generic에 들어가는 인자에 대한 런타임 추론이 역시 계속 필요한데, 이를 구현하기 위해서 중복된 코드가 불필요하게 들어가는 문제)

이 내용과 관련해서도 깊이 알아보면 재밌을 것 같다. 

## Nuxt-typescript 설치

기존의 프로젝트는 그대로 두고 `create-nuxt-app`로 새로운  Nuxt 프로젝트를 만들어준다.  JS가 아닌 Typescript를 선택해서 설치해준다. 

![screen 9.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/1.png)

그리고 과감하게  기존에 있던 파일들(pages, components, store, middleware 등. package.json등은 제외)을 통째로 복사해서 대치해본다.  어마어마한 오류를 뱉어낼 것이라고 생각했지만 의외로 문제없이 돌아간다. 

<div>
 <img width='30%'src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/2.png"/>
</div>

<Br/>

이 많은 파일들을 통째로 옮겼는데 컴파일 문제가 발생하지 않았다.
당연하기도 한 것이 js로 된걸 ts로 바꾸지도 않았기 때문이다 .

### tsconfig.json 설정

```jsx
//tsconfig.json

{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": [
      "ESNext",
      "ESNext.AsyncIterable",
      "DOM"
    ],
    "esModuleInterop": true,
    "allowJs": true,
    "sourceMap": true,
    "strict": false,  //여기를 false로만 해줘도 대부분의 오류는 사라진다. 
    "noEmit": true,
    "experimentalDecorators": true,
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./*"
      ],
      "@/*": [
        "./*"
      ],
      "~~/*": [
        "./*"
      ],
      "@@/*": [
        "./*"
      ]
    },
    "types": [
      "@nuxt/types",
      "@nuxtjs/axios",
      "@types/node"
    ]
  },
  "exclude": [
    "node_modules",
    ".nuxt",
    "dist"
  ]
}
```
<br/>

### vue-shim.d.ts 작성

공식문서대로 루트 프로젝트 아래에 vue-shim파일도 만들어주자. 타입스크립트가 .vue로 끝나는 파일을 해석할 수 있게 도와준다. 

```jsx
// vue-shim.d.ts
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
```
<br/> 

### nuxt.config.js 수정

```jsx
export default {
  buildModules: ['@nuxt/typescript-build']
}
```
<br/>

## 파일 ts로 바꾸어서  테스트 해보기

기본이 되는 진입 페이지를 바꾸어서 문제 없이 잘 돌아가는지 테스트 해본다.  이제 아래와 같은 템플릿을 기본으로 작성을 해주면 된다.

```html
<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
	name: 'LandingMain',
  components: {
    SideMenu: () => import('~/components/common/side-menu'),
  },
	data: () => ({
    isSideMenuOpen: false,
  }),
	// .... 그 외 기타 로직들 복사 붙여넣기
})

</script>
```

일단 문제가 없이 잘 돌아가는 것 같지만, ts가 적용되고 있는지 확인하기 위해 아래와 같이 테스트를 해보자. 

어 뭐지 안된다.



<div>
 <img width='50%'src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/3.png"/>
</div>
<br/>

tsconfig.json의 `strict:false`  여서 그렇다. true로 놓고 다시 하면 작동한다. 


## Store에 Vuex 적용하기

아직  `this.$store`로 타입을 추론할 시 여전히 any로 나온다. 

Store에만 잘 타입 적용이 잘 될 수 있다면 나머지는 이제 시간문제라고 생각했다. 만약 mapState, mapMuations와 같은 Vuex 라이브러리를 사용한다면 Store에 어떤게 들어가는지 잘 추론할 방법이 없다. 

두 가지 방법이 있다.

- 장기효님(캡틴 판교)의 방법처럼 this.$store.dispatch와 같은 방법을 사용하는 방법
- Nuxt공식 가이드에 있는 Vanila + **[nuxt-typed-vuex](https://typed-vuex.roe.dev/) 라이브러리를** 이용하는 방법



장기효님 방법이 개인적으로는 마음에 들지만, map함수를 사용할 수 있는 Nuxt 추천방법 [Store](https://typescript.nuxtjs.org/cookbook/store/#vanilla) 을 사용하기로 하였다. 

mapMutation, mapState등이 기존 프로젝트에 많이 활용된 터라. 이를 다 바꾸기에 드는 시간 소요가 너무 크다고 판단했다. 연관된 라이브러리에 대한 의존성이 점점 높아지는 느낌이 강하지만, 최대한 공식문서에 있는 방법을 따르기로 하였다. 


<div>
 <img width='20%'src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/4.png"/>
</div>
<br/>


 

레거시 프로젝트는 위와 같은 형태로 store들을 가지고 있다. 최상단에 `index.ts`를 만들어주고 common submodule을 등록해보자. 

common이라는 폴더 아래에 테스트용으로 아래와 같이 해본다.  내용이 더 많지만, 실무프로젝트라서 공개할수는 없다.

```tsx
// store/common/index.ts
export const mutations = {
  updateIsLoading (state, isLoading) {
    state.isLoading = isLoading
  },
}

type ServiceMain = {  // 테스트용으로 생성
  id: number
}

export const state = () => ({
	isLoading: false, 
  serviceMain: [] as ServiceMain[],
})

export type commonState = ReturnType<typeof state>
```

common 모듈을 아래와 같이 등록해준다. 

```tsx
// store/index.ts
import { getAccessorType } from 'typed-vuex'
import * as common from './common'

//아래는 컴파일 되는 것이 아니라 store에 해당하는 타입추론들을 도와주는 것이다.
export const accessorType = getAccessorType({
  modules: {
    common,
  },
})
```

accessorType을 `d.ts파일`에 정의시켜주자.

```tsx
// 루트폴더 아래에 vue-shim.d.ts

import { accessorType } from './store'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}
```

그럼 이제 아래와 같이 제대로 추론되는 걸 볼 수 있다.


<div>
 <img width='80%'src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211109/5.png"/>
</div>
<br/>