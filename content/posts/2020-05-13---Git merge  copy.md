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
그리고 안다고 한다는 것들도 실질적으로 정확히 아냐라고 물어보면 정확히 모른다.
그래서 이번 기회에 Git 포스팅을 해보려고 한다.

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

## git commit --amend

amend 옵션을 주면 예전 git commit를 수정할 수 있다. 이는 내가 어떤 작업을 수행하는 중인데, 커밋을 하기에는 애매한 상황에 사용할 수 있다.

다만 문제는 원격저장소에 Push할 경우 일단 문제가 생기며 (-f 옵션을 주면 되기는 한다.), 협업하는 사람이 때에 따라 이전 커밋으로 되돌아가야 하는 문제점이 있다.

## git merge

병합시에는 두가지 옵션이 있다.

1. Merge
2. Rebase

merge시에는 **각 브랜치의 마지막 커밋 두개, 브랜치의 공통 조상**을 사용하여 3-way 병합을 시행한다.

이 Rebase라는 것은 말 그대로 공통 조상을 다른 branch의 커밋으로 변경하는 것을 의미한다.

git rebase는 가지를 잘라서 예쁘게 만들고 싶을때 사용한다. 추상적인 말이긴 하지만, 가장 정확한 말이다.
git rebase를 사용하면 커밋을 예쁘게 관리할 수 있고 단순화된다는 장점이 있다.
