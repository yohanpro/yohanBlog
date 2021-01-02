---
title: git private repo에서 pull할 때 로그인 정보 저장하기
date: "2020-07-14"
template: "post"
draft: false
slug: "/posts/git/github-access"
category: "git"
tags:
  - "github"
  - "private repo"
  - "Developer settings"
  - "Personal access tokens"
description: github private 레포에서 가져올시 Personal access tokens 사용하여 아이디, 패스워드 생략하기
---

회사에서 서버에 올려 배포하려고 하면 다음과 같은 과정을 거친다.

1. EC2 ubuntu linux 접속
2. Git clone 레포지토리
3. Github 아이디와 패스워드 입력
4. `npm start`

문제는 Github 아이디와 패스워드를 계속 입력해야 하므로 매우 짜증이 난다.<br>
특히나 테스트 서버는 특성상 자주 올려보고 테스트를 할 수 밖에 없는데, 10번 수정을 한다면 10번 아이디와 패스워드를 입력하는 번거로운 절차를 거쳐야 한다.

따라서 Github계정을 저장해놓을 수 있다면 간소화할 수 있고, 정신건강에도 이롭다.<br>
최종적으로는 배포자동화를 사용해서 Github나 원격저장소에 저장하는 순간 자동으로 배포가 되도록 만들어야 할 것이다.

## 설정하는 방법

- github에 들어가서 setting을 누른다.

<img style="width:30%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/1.png">

- Developer settings 클릭
  <img style="width:60%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/2.png">

- Personal access token 클릭
  <img style="width:45%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/3.png">

- Generate new token
  <img style="width:80%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/4.png">

- 다음과 같이 설정 잘 읽어보고 해당하는 사항에 체크하면 된다.
  <img style="width:90%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/5.png">

여기까지 잘했다면 토큰이 발급된다.
<img style="width:90%; margin-top:1em;" src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/git/6.png">

이제 이 토큰을 복사해서
리눅스 ec2 서버에 접속한 후 설정을 해주면 된다.

리눅스 접속 후
이미 clone한 상태라면

```bash
$ git remote set-url origin https://accessCode붙여넣기@github.com/유저이름/repo이름.git
```

아니면 아예 ssh로 clone해버리면 된다.

```bash
$ git clone <ssh address>
```

이렇게 하면 앞으로 비밀번호를 묻지않는다. 반복되는 귀찮은 작업을 줄이고 많은 시간을 절약할 수 있다.
