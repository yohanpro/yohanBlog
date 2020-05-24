---
title: create-react-app 템플릿 오류 해결방법
date: "2020-05-24"
template: "post"
draft: false
slug: "/posts/tip/react-not-install"
category: "react"
tags:
  - "create-react-app 오류"
  - "npx create-react-app my-app --template typescript"
  - "rm -rf /usr/local/bin/create-react-app"
description: A template was not provided. This is likely because you're using an outdated version of create-react-app. 해결방법
---

```bash
$ npx create-react-app my-app --template typescript
```

를 사용해서 템플릿 좀 만들어보려 했는데 어찌된 영문인지 template이 제공되지 않는다고 뜬다.<br>
아무래도 보안상의 이유로 `create-react-app`을 글로벌로 설치해서 사용하는 것을 더 이상 제공하지 않는 모양이다.<br>
요즘 들어 이런 글로벌 cli툴들이 점점 deprecated 되어 가는 추세이다.

정확히는 아래와 같은 내용이다.

<figure>
  A template was not provided. This is likely because you're using an outdated version of create-react-app.<br>
  Please note that global installs of create-react-app are no longer supported.
</figure>

그래서 stackoverflow에서 검색해보니 `create-react-app`을 uninstall한 후 다시 설치하라고 한다.

## uninstall 해주기

```bash
$ sudo npm uninstall -g create-react-app //제거하고

$ npx create-react-app my-app //다시 설치

```

<br>

## 그래도 안될때

보통의 경우 이렇게만 해줘도 잘 되는 모양이다.

하지만 이렇게 해도 `create-react-app` 글로벌 파일이 설치된 디렉토리가 다를 경우 여전히 되지 않는다.<Br>
그럴 경우 어디에 `create-react-app`이 설치되어 있는지 확인한다.

```bash
$ which create-react-app

-> /usr/local/bin/create-react-app
```

이렇게 한후 `rm -rf`로 해당 디렉토리를 전부 삭제해주어야 한다. 위에서 위치가 `/usr/local/bin/create-react-app`로 나왔으니 아래와 같이 삭제해준다.

```bash
$ rm -rf /usr/local/bin/create-react-app
```

이제 잘 된다!
