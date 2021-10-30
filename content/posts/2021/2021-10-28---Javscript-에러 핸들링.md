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
JS를 쓰다가 보면 Error를 어떻게 핸들링 하면 좋을지 고민하게 되는 순간이 온다.

프론트와 백엔드에서 각각 만드는 에러가 다를 건데 그래도 기본은 같다.

에러 핸들링 기법은 아래 블로그와 내 생각 그리고 봐온 코드들을 참고하였다. 

[커스텀 에러와 에러 확장](https://ko.javascript.info/custom-errors)

### try catch 에러처리

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

### 에러의 확장과 상속

에러를 확장하게 되면 조금 더 편하게 사용하게 될 수 있다. 일일이 이름을 지정해주는 등의 번거로운 작업을 피할 수 있다. 

```jsx
class MyCustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ReferenceCustomError extends MyCustomError {
  constructor(message) {
    super(message);
  }
}

function test(){
	throw new ReferenceCustomError("커스텀 레퍼런스 에러");
}

try {
	test()	
} catch (err) {
	err.message // 커스텀 레퍼런스 에러
	err.name // ReferenceCustomError <- 이름을 지정해주지 않아도 들어가게 된다.
}
```

### 잘 알겠어. 이제 실무를 보여줘.

위의 내용들은 분명 JS를 배울때 한번쯤은 봤을 내용이다. 다만, 이제 이걸 실무에서 사용하려고 하면 어떤식으로 짜야할까 고민이 많이 된다. 

프론트는 백엔드와 에러를 주고받을 때 일종의 규칙을 정하고 받게 된다. 

예를 들면 백엔드에서 API를 보낼 때 다음과 같이 정해진 형식으로 보내준다고 하자. 

```json
// status 200
{
	"success": true,
	"response": {
		"user": "John"
	},
	"error": null
}

// status 400
{
	"success": false,
	"response": null,
	"error": {
		"message": "잘못된 요청입니다. name은 필수입니다."
	}
}
```

이럴 경우 백엔드에선 이렇게 템플릿을 생성해서 보내주면 된다.

아래는 Nodejs예시이다.

```jsx
// exceptions.js
class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "잘못된 요청입니다.") {
    super(400, message);
  }
}
```

위를 보면 HttpException을 부모로 하여 BadRequestException을 만들고 있다. 

```jsx
// user.js

import { BadRequestException } from './exceptions.js';

router.post("/user/:id", async (req, res, next) => {
	const { name } = req.body;
	if(!name) {
		throw new BadRequestException("잘못된 요청입니다. name은 필수입니다.")
	}

	// 성공시 DB에 넣는 로직인데, 조금 이상하지만, 일단 넘어가자.
	const [result] = await userRepository({name});

	res.send({
		success: true,
		data: result,
		error: null,
	})
});
```

이렇게만 끝나면 안된다. throw를 던졌을 때 처리해 주는 곳이 필요하다. Node.js에서는 이를 글로벌 에러 미들웨어에서 처리할 수 있다.

```jsx
//app.js

// error middleware.. 작성하는 위치에 주의하자. 

export const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    success: false,
    response: null,
    error: {
      status: error.status,
      message: error.message,
    },
  });
};

app.listen(3000)
```

`this.status와` 

### React에서 사용하는 방법