---
title: Nuxt 프로젝트 Typescript 입히기 - vuex와 store 적용
date: "2021-11-18"
template: "post"
draft: false
slug: "/posts/js/nuxt-ts-vuex"
category: "react"
tags:
  - "nuxt"
  - "Vue"
  - "Typescript"
  - "Nuxt+Ts"
  - "typed-vuex"
  - "vuex"
  - "store"
description: Nuxt 프로젝트에 Typescript에 Vuex, Store 적용하기 (with typed Vuex)
---
[Introduction](https://typed-vuex.roe.dev/accessor/.accessor-introduction)

사용방법은 위에서 잘 나와있다.  nuxt-type-vue documentation이다.  이는 Nuxt팀에서 공식문서에서도 추천하는 라이브러리이다. 
웬만하면 외부 라이브러리를 사용하지 않았을건데 Nuxt 공식문서에 있는것이니 어느 정도 신뢰성은 있다.

[Store](https://typescript.nuxtjs.org/cookbook/store#accessing-the-store)

- getter, setter, action 등을 도와주는 `getterTree, setterTree, actionTree`등의 helper함수가 존재하지만, vanila로도 타입설정이 가능하다.
- 이 안에서는 타입추론이 가능하여 `this.$router`등이 가능함
- 아래와 같이 사용한다.

```tsx
// store/index.ts

import { getAccessorType } from 'typed-vuex'

// Import all your submodules
import * as common from './common'
import * as auth from './auth'
// Keep your existing vanilla Vuex code for state, getters, mutations, actions, plugins, etc.
// ...

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({

  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    common,
    auth,
  },
})

```

- `store` 루트 폴더 아래에 `index.ts`를 만들어 주고 이 아래에 `accessorType`을 정의해준다. 이 `accessorType`은 컴파일 되지 않고 오로지 타입추론을 위한 도구이다.

```tsx
export const action = actionTree({state}, {
	async foo(){
		const result = await this.$axios().then(response=>response.data)
		this.$router.push('/bar') // actionTree 등과 같이 감싸지 않으면 router 타입을 추론할 수 없다.
	}
})
```

actionTree로 감싸주지 않는다면 위에 `this.$axios()`의 추론이 불가능하다.  action을 별도의 파일로 분리했을때의 해결방법은 시도3에 있다.

### middleware의 authenticate 로직

미들웨어 폴더에 있는 로직들은 아래와 같은 방법으로 처리하면 된다. 

```tsx
import { Context } from '@nuxt/types'

export default async ({ redirect, app: { $accessor } }: Context) => {
  const { isAuthenticated, token } = $accessor.auth
  let result
  if (!isAuthenticated) {
    try {
      result = await $accessor.auth.refreshToken(token) 
    } catch (err) {
      redirect('/auth/login')
    }
    if (!result) { redirect('/auth/login') }
  }
}
```
<br>

## 분리되어 있을때 처리문제🤔

actions가 너무 길어져 별도의 파일로 분리되어 있을때는 어떻게할까?

- 분리되지 않고 한 `Index.ts`에 처리할 경우 다른 파일에서 action에 대한 Typescript가 추론이 가능하다.
- 그러나 `Index.ts`와 `actions.ts`로 나누고 action을 `export default`로 처리하면 추론이 안된다.

만약 `actions.ts`를 따로 분리하고  그대로 가져가도 실제 런타임에서는 문제가 없다. 

다만 타입스크립트에서 오류를 뱉는다. 공식 라이브러리 문서에도 통합된 파일에 대한 설명만 있을뿐 분리되었을때 처리에 대한 이야기는 없다.

### 시도 1

```tsx
// store/auth/actions.ts
export const authActions = actionTree({ state, getters }, {
  async checkToken ({ dispatch, state }) {
    if (state.isAuthenticated) {
      return true
    }
		...
}
```

```tsx
// store/auth/index.ts

import { authAction } from './actions'

export const actions = authAction
```

이런방식으로 처리하면 타입추론이 되기는 한다. 하지만 이 방식은 vuex에서 동작하지 않는다.

```bash
Uncaught Error: [vuex] actions should be function or object with "handler" function but "actions.authActions" in module "auth" is {}.
```

- `nuxt store`는 폴더에 따라 기본 내보내기를 사용하고 있는데.  `export default`로 내보내기가 되지 않았기 때문에 위와 같은 오류를 내뿜는다.
- 두 가지를 다 만족시켜야 한다. 즉. 기본 내보내기로 actions를 내보내고 또 `nuxt-type`에서도 추론할수 있게끔 `actionTree`를 내보내야 한다.

### 시도 2

`index.ts`에서는 `export default`를 하고 actions로부터 가져온다.

결과는 아래와 같다.

```tsx
// store/auth/index.ts

import * as authActions from './actions'

...

export default {
  actions: authActions.default,
  getters,
  state,
  mutations,
}
```

그리고 `store/index`에서는 default로 가져와서 넣어준다.

```tsx
// store/index.ts

import { getAccessorType } from 'typed-vuex'
import common from './common'
import auth from './auth'

export const accessorType = getAccessorType({
  modules: {
    common,
    auth,
  },
})
```

actions가 default로 내보내졌기 때문에 불러올때도 `authActions.default`로 가져와야 한다. 

결과적으로 중복도 생기고 못생긴 코드가 되어버렸지만, 이것만큼 구조를 많이 안바꾸고 타입스크립트를 쓰는 방법도 없는 것 같다.

이제 mapGetter와 mapSatate등으로 만들어진 기존 코드를 `this.$accessor` 로 변경해주면 된다.

```tsx
// 기존 코드
computed: {
    ...mapState('common', ['serviceMain']),
 },

// 바뀐 코드
computed: {
  serviceMain () {
    return this.$accessor.common.serviceMain
  },
},
```
<br>

### 시도 2에서  문제 발생

이럴경우 nuxt를 시작할 때 Store를 빌드하는 과정에서 reference 오류가 생긴다.

### **ReferenceError**

Cannot access 'state' before initialization

즉 . `import* * *as* authActions *from* './actions'` 하는 과정에서 actions를 불러오는데 이때 state가 initialization이 되어 있지 않기 때문에 나타나는 문제이다.

이걸 해결하려면 결국 state를 가져와서 사용하면 안된다는 결론이 나온다. 이제 시도3으로 간다.

### 시도 3 (문제 해결 & 적용)

actionTree를 사용하지 않고, Vanila로 타이핑한다. 

그 이유는 actionTree에 NuxtStoreInput 타입의 인자를 넘겨줘야 하는데, 위 오류처럼 {state, mutation 등} 을 initialiase 이전에 가져올수 없기 때문이다.

Vanila로 사용하는 방법에 대한 예제는 [여기](https://typed-vuex.roe.dev/store/actions#example)에 나와 있지만 사실 이 예제는 잘못된 부분이 있다.

`Store, ActionContext` 타입을 `vuex/types`에서 가져와야하는데  어디서 import 해오는지에 대한 명시가 없다.

```tsx
import { Store, ActionContext } from 'vuex/types'
```

이걸 잘못하여 Store를 vuex에서 가져오거나 `ActionContext`를 'typed-vuex'에서 가져오면 오류가 발생한다. 



- RootState를 `store/index.ts`에 정의해주기

```tsx
// store/index.ts

import { getAccessorType } from 'typed-vuex'

import common, { CommonState } from './common'
import auth, { AuthState } from './auth'

export interface RootState {
  commonState: CommonState,
  authState: AuthState
}

export const accessorType = getAccessorType({
  modules: {
    common,
    auth,
  },
})
```
<br/>

`RootState`를 가져와서 actions를 다시 작성해보자.

```typescript
import { Store, ActionContext } from 'vuex/types'

export default {
  async fetchCountries (
      this: Store<RootState>,
      { state, commit }: ActionContext<CommonState, RootState>,
    ) {
     console.log('fetch countries')
  },
}

```


이제 나머지는 시도 2와 마찬가지로 각각의 action들을 `index.ts`에 import를 해주면 된다.

```tsx
// store/auth/index.ts

import * as authActions from './actions'

... 

export default {
  actions: authActions.default,
  state,
  mutations,
}
```

일단 문제들은 다 해결된것 같다 !