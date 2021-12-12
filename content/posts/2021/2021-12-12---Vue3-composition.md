---
title: Vue3 Composition API 입문
date: "2021-12-12"
template: "post"
draft: false
slug: "/posts/vue3/vue3-composition-api-introduction"
category: "vue"
tags:
  - "Vue3 Composition API"
  - "Composition API"
  - "Vue3"
  - "Vue"
description: Vue3의 꽃 Composition API를 사용해보자.
---
## 왜 Composition API를 도입해야 했고 이게 왜 Vue3의 꽃인가?

Vue는 왜 Vue3에서 composition api를 도입하려고 하였고. 이걸 통해서 무엇을 해결하려고 하였을까?

Vue 공식홈페이지에 나와있는 문서 도입부를 참고하면 한문장으로 정리할 수 있다.


 > 👉🏻 논리 로직이 연관된 코드들을 하나로 묶어 **생산성 높게 사용하기 위함**


이미 Vue 자체는 component들을 쉽게 나눌 수 있고. Import하여 사용하기 쉽게 되어 slot등을 사용하여 재사용성할 수 있게 되어있다. 

하지만 다음과 같은 로직들을 다룬다면 한 컴포넌트에서 처리를 해야 하며. `data, watch, methods, computed`에 들어가는 논리 로직들이 꼬이기 쉽다. 

```jsx
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // using `this.user` to fetch user repositories
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

위 코드를 전부 안 읽어도 괜찮다. 주위깊게 봐야 할 곳은 숫자로 표시된 부분이 들쭉날쭉하다는 것이다. 

내가 이 프로젝트의 컴포넌트 로직을 수정해야 하는 일이 생겼다고 가정해보자.

1. user를 props를 받아오는 것을 확인
2. mounted로 가서 `this.getUserRepositories`로 외부 API를 백엔드에서 받아오는 것을 확인
     이게 data로 repository가 연결
3. 그런데 `watch`에서도 `userRepository`에 바인딩 된 데이터의 로직흐름 확인하기
4. `repositoriesMatchingSearchQuery`를 보고 `data`에 있는 `searchQuery`가 제대로 들어가게 되는지 확인

...

복잡하지 않은가? 나라면 진작 길을 잃어버렸을 것이다. 인간이 수정해야 하므로 로직을 따라가는데만 벅차다. 

<div>
<img style="width:20%;" src="https://v3.vuejs.org/images/options-api.png"/>
</div>
<Br>

색깔이 같은 것이 연관된 로직들이다. 딱 봐도 흐름을 따라가려면 위 색깔블록들 사이를 왔다갔다해야 하는데, 코드 뭉치가 커지면 커질수록 개발자가 느끼는 피로감이 늘고 이해력이 줄어들 수 밖에 없다. 이는 생산성 저하로 이루어진다.

__"아니, 좀. 아예 연관된 로직들을 하나로 묶어서 그걸 확인해야 하지 않나? 그래야 개발 생산성이 높아질 수 있지 않을까?"__
가 composition API의 핵심이다. React hook과 같은 기능을 사용하게 하기 위함이냐는 이 문제를 해결함으로써 얻을 수 있는 부차적인 이득이라고 봐야 한다. 


### Composition의 시작과 끝인 setup함수

이 setup함수는 Vue 라이프사이클에서는 created 이전에 호출된다. `created`는 VirtualDom과 template이 만들어지기 전에 호출된다는 점을 기억해두자. 

라이프사이클 다이어그램을 보면 알 수 있지만 setup함수가 실행되는 구간은 `created`와 `beforeCreate` 그 쯤이다. `created` 내부에서는 `this`로 vm 인스턴스에 접근할 수 있기 때문에 setup도 접근 가능하긴 한다.

**하지만 setup내에서 `this`는 컴포넌트를 바인딩하지 않아 data나 computed를 가리키지 않으므로 쓰지 말아야 한다.** 

> You should avoid using `this` inside `setup` as it won't refer to the component instance. `setup` is called before `data` properties, `computed` properties or `methods` are resolved, so they won't be available within `setup`.

Vue 공식 Compositon Tutorial에서는 위에서 설명한 코드를 베이스로 해서 이 모든 작업을 setup 함수로 리팩토링하는 모습을 보여준다. 

자 그러면 이렇게 바뀐다. 

```tsx
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the end results under the `repositories` name
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

Composition API에서 해결하려고 했던 부분들이 잘 적용된 모습이다.  그리고 기존에 Options API로 조각조각 나있던 로직들이 하나의 setup 함수내로 옮겨진 것을 확인할 수 있다. 

그리고 이렇게 로직들이 일관성있게 바뀌었다.

![https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png](https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

하지만 여기서 당연히 의문이 하나들 수 밖에 없다. 

> **Vue3에서는 기존 Options API를 setup함수로 마이그레이션 하는 것을 원하는 것일까?**

위에서 보다시피 기존 Options들을 하나도 이용하지 않고 Vue를 이용할 수 있다. 

## Composition API가 Options API를 대체하지는 않음

Composition API가 기존 문법을 사용하지 않고도 작성할 수는 있지만 이게 하나를 밀어낸다고는 아직 생각이 들지 않는다. 

Composition API는 등장한 목적 자체가 공통의 logic들을 하나로 관리하고자 하는 필요성을 느껴서 나온것이다.

즉. 기존에 있는 컴포넌트에서 한눈에 보기에 복잡하지 않은 로직들을 가지고 있다면 (이게 바람직하기도 하다), 굳이 setup을 이용해서 작성할 필요는 없다. 

하지만 기존에 각각 Template 안에서만 유효했던 함수들을 mixins같은 문법을 사용하지 않고 hook 형태로 쉽게 변형할 수 있다는 것은 매우 큰 장점이다.

[Do I have to use the Composition API in Vue 3, or can I still do things the "Vue 2" way?](https://stackoverflow.com/questions/68611657/do-i-have-to-use-the-composition-api-in-vue-3-or-can-i-still-do-things-the-vue)