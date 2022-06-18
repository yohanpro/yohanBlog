---
title: ant design vue customize less-loader 오류 해결하기
date: "2022-06-04"
template: "post"
draft: false
slug: "/posts/vue/ant-design-less-오류-해결"
category: "programming"
tags:
  - "this.getOptions is not a function"
  - "ant design vue"
  - "less-loader"
  - ""
description: "TypeError: this.getOptions is not a function"
---

## TL;DR;

> 1. 만약 `main.ts`파일에서 **css**로 import하고 있었다면 `import "ant-design-vue/dist/antd.less";`로 바꾸어준다.
> 2. `less-loader`가 없다면 less-loader를 devDependency로 추가해준다.
> 3. less-loader의 버전이 `6.0.0`버전이 아니라면 확인하고 6버전으로 바꾸어준다.

Vue Cli + ant design vue로 만든 프로젝트에 커스텀 테마를 주입하는데 아래와 같은 오류가 생겨서 진행이 안된다.

```bash
Syntax Error: TypeError: this.getOptions is not a function

 @ ./node_modules/ant-design-vue/dist/antd.less 4:14-188 15:3-20:5 16:22-196
 @ ./src/main.ts
 @ multi (webpack)-dev-server/client?http://172.30.91.109:8080&sockPath=/sockjs-node (webpack)/hot/dev-server.js ./src/main.ts

No issues found.

```

<br>

저렇게 함수 type을 찾을 수 없다는 오류가 생긴다면 보통 loader들의 버전문제일 가능성이 높다. 일단 안되는 이유를 공식문서에서 찾아보았다.

[Ant-design-vue](https://2x.antdv.com/docs/vue/customize-theme)에서 Not working?이라는 섹터로 가게 되면 아래와 같이 써있다.

> If you import styles from 'ant-design-vue/dist/antd.css', change it to ant-design-vue/dist/antd.less.

우선 less파일을 load하고 있지 않았기 때문에 less로 import 해준다.

```js
/* main.ts */
// import 'ant-design-vue/dist/antd.css'; <- 삭제
import "ant-design-vue/dist/antd.less";
```

<br>

이렇게 되면 아래와 같이 오류를 뱉어낸다.

```bash
 ERROR  Failed to compile with 1 error                                                                                                                오후 10:20:14

Failed to resolve loader: less-loader
You may need to install it.
No issues found.

```

<br>

당연히 less-loader를 devDependency에 설치해준다.

```bash
yarn add -D less-loader
```

<Br>

이렇게 진행했음에도 여전히 오늘 포스팅할 오류가 계속 나온다. `TypeError: this.getOptions is not a function`

```bash

 error  in ./node_modules/ant-design-vue/dist/antd.less

Syntax Error: TypeError: this.getOptions is not a function

 @ ./node_modules/ant-design-vue/dist/antd.less 4:14-188 15:3-20:5 16:22-196
 @ ./src/main.ts

```

<br>

역시 어마어마한 삽질을 하고 알아낸 결과 less-loade가 2022년 6월 기준 11버전이 최신인데 ant-design-vue에서는 6버전을 써야 한다는 것을 알아냈다.
따라서 6버전을 설치해주자. 그러면 잘 된다.

```bash
yarn add -D less-loader@6.0.0
```

<Br>

함정은 less-loader 6버전을 사용하라는 내용이 이미 ant-design-vue 문서에 있었다.

```js
// vue.config.js for less-loader@6.0.0  <--- 여기에 이미 버전 명세가 있었는데 간과했다.
module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#1DA57A",
            "link-color": "#1DA57A",
            "border-radius-base": "2px",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
```

<Br>

6.0.0버전은 2020년 4월 25일에 나왔는데 너무 ant-design에서 업데이트가 느린것이 아닐까 생각한다. 아무튼 공식문서에 나오는 내용들은 정말 꼼꼼히 읽어봐야 한다.
