---
title: (Jest) Testing 프레임워크 사용해보기
date: "2020-04-17"
template: "post"
draft: false
slug: "/posts/js/jest-basic"
category: "JS"
tags:
  - "javascript"
  - "Jest.js"
  - "Testing"
  - "인터뷰"
  - "JS 테스팅"
description: 테스팅 프레임워크인 Jest의 기본 사용법에 대해 알아보자.
---

## 테스팅의 필요성

js로 어느정도 규모가 있는 웹어플리케이션을 만들다보면 test 코드를 작성해야할 일이 생긴다.
지금 당장은 번거롭다고 느껴질 수 있겠지만 장기적으로보면 오히려 작업효율을 높여줄 수 있다.

예를 들어서 내가 웹사이트를 만들다가 내가 만든 코드가 잘 작동할지 안할지 궁금하다.<br>
그렇다면 테스트해보는 방식은 이렇다.

1. 코드를 작성한다.
2. 서버를 실행한다.
3. URL로 들어간다.(localhost든, 테스트 서버든)
4. 클릭해보거나 Postman 같은 것으로 API를 보내거나 request를 보낸다.
5. 잘 동작하는지 확인한다.
6. 만약 잘 작동하자 않는다면 1번으로 돌아가 잘 작동할때까지 테스트한다.

약속한 납품기한이 점점 조여오거나 급히 확인해야할 일이 생기면
하루에도 수백 번씩 서버를 껐다 키거나, 변경사항을 깃허브에 push했다가 pull했던 자신의 모습이 생각날 것이다.

테스팅도구를 사용한다면 굳이 그럴 필요 없이 커맨드 한 줄로 테스트를 해볼 수 있다.

꼼꼼하게 모듈화하여 작성할 수 있다면 미래의 누군가가 다시 만질 일이 생길 때 편해질 것이다.

## Jest란?

js 테스팅 도구는 오늘 소개할 Jest 말고도 [Mocha](https://mochajs.org/)가 있는데 쓰임새나 사용방법이 비슷하고 하는 역할도 비슷하다. 편한 것을 골라쓰면 된다.<br>
[Jest](https://jestjs.io/)는 Facebook에서 만들었고 Twitter, Airbnb에서도 테스팅에 사용하고 있다.
또한 `create-react-app`을 이용해서 프로젝트를 만들었다면 따로 설치할 필요도 없이 프로젝트에 내장이 되어 있다는 것도 장점이다.

Document도 굉장히 잘 되어 있고 Babel, Typescript, React, Augular, Vue에서도 잘 작동한다.

## 사용해보기

`npm`이나 `yarn`으로 설치한다.

```js
npm install --save-dev jest
```

그리고 일단 `package.json`의 script 부분에 이렇게 한번 넣어주자.

```js
"scripts": {
  "start": "node src/index.js",
   ...
  "test": "jest"
},

```

프로젝트 루트 디렉토리에 `tests` 폴더를 만들어 준다. 이름은 크게 상관없다.
그리고 나는 `sum.js`파일을 만들어 준다.

```js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

동일 폴더에 `sum.test.js` 파일을 만들어주었다. jest는 .test가 붙은 파일을 자동으로 감지해 테스트를 실행한다.

```js
const sum = require("./sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

<br>

`npm run test` 커맨드를 사용하면 다음과 같은 결과를 볼 수 있다.

<img class="mb-4" style="width:80%;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/jest/screen+7.png">

## Global로 설치하여 CLI로 실행해보기

글로벌로 설치가 가능하다. 그리고 option을 주면 특정 폴더에 있는 특정 파일만 지칭하여 테스팅을 진행해볼 수도 있다.  
이렇게 하려면 jest가 Global로 설치되어 있어야 한다.

```bash
npm install jest --global

```

그리고 jest 테스트를 해보고 싶은 Path를 직접 입력해주면 된다.

```bash
jest my-test #or
jest path/to/my-test.js

```

<br>
