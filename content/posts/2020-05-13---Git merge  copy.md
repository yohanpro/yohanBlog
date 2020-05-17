---
title: Git 개념 잡기
date: "2020-05-18"
template: "post"
draft: true
slug: "/posts/git/concept"
category: "Git"
tags:
  - "Git"
  - "concept"
  - "rebase"
  - "tag"
  - "--no-ff"
  - "git 브랜치 관리"
description: Git 개념 잡기
---

Git을 사용하지만 쓰는 것만 쓰기 때문에 잘 모르고 넘어가는 개념들이 있다.
그리고 안다고 한다는 것들도 실질적으로 정확히 아냐라고 물어보면 정확히 모른다. <br>
그래서 이번 기회에 아주 단단히 잡아보고자 Git 포스팅을 시작한다.

## tag

Tag는 보통 릴리즈할 때 사용한다(v1.0). 태그는 압정핀 같은 것으로 고정! 해놓았다고 생각하면 된다. <br> HEAD나 branch의 경우 hash 값은 commit을 하게 되면 값이 변하는 반면, tag의 경우 압정핀으로 고정해 놓았기 때문에 해시값이 변하지 않는다.

**push를 할 때 저절로 공유되지 않는다.** 이 때문에 만약 공유를 하고 싶다면

```bash
$ git push origin <태그 이름>
```

와 같이 push 해주어야 한다.

## Head

Head는 포인터가 현재 가리키고 있는 곳이라고 생각하면 된다.
현재 기준이 되고 있는 commit이 뭔지, branch가 뭔지 등을 알려주는 것이다.
