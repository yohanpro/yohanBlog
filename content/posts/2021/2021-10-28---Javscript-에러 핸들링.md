---
title: Javscript 커스텀 에러 class
date: "2021-10-28"
template: "post"
draft: true
slug: "/posts/js/error-handling"
category: "react"
tags:
  - "error",
  - "HttpError",
  - "커스텀 에러",
  - "에러 확장",
  - "NodeJS",
description: Error를 잘 활용해서 사용해보기
---

https://ko.javascript.info/custom-errors

JS를 쓰다가 보면 Error를 어떻게 핸들링 하면 좋을지 고민하게 되는 순간이 온다.

프론트와 백엔드에서 각각 만드는 에러가 다를 건데 그래도 기본은 같다.

에러 핸들링 기법은 아래 블로그와 내 생각 그리고 봐온 코드들을 참고하였다. 

[커스텀 에러와 에러 확장](https://ko.javascript.info/custom-errors)

### trycatch 에러처리

```jsx
try {
	const user  = await getInfo(userId)

} catch (e) {
	console.log(`error: ${e}`)
}
```

잘 아는 것처럼 try catch에서 오류가 나면 아래 catch에서 error로 간다.  단순히 에러를 출력하는데 그치지 않고 시멘틱하게 오류를 처리하고 싶다.

```jsx
class UnauthorizedException extends Error {
	constructor(message){
		super(message)
		this.name='너는 권한없음 에러'
	}
}

function test(){
	throw new UnauthorizedException("너는 없다. 권한. 돌아가라");
}

try {
	test()	
} catch (err) {
	err.message // 너는 없다. 권한. 돌아가라
	err.name // 너는 권한없음 에러
}
```

### 리액트에서 사용하는 방법 (커스텀 훅)

프론트는 백엔드와 에러를 주고받을 때 일종의 규칙을 정하고 받게 된다.