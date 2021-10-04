---
title: psql "/tmp/.s.PGSQL.5432" 에러
date: "2021-10-04"
template: "post"
draft: false
slug: "/posts/postgresql/error-5432"
category: "postgresql"
tags:
  - "postgresql"
  - "S3"
  - "/tmp/.s.PGSQL.5432"
  - "could not connect to server: No such file or directory"
  - "connections on Unix domain socket"
description: psql error could not connect to server No such file or directory
---
뭔일인지 모르겠는데 Bigsur 11.6 버전을 설치했는데 아래와 같이 오류가 뜨며 psql이 안된다. 😳

에러 내용만 보아하니 실행 PATH가 잘못된 것 같다. 이런게 정말 골치아프다. 

```jsx
psql: error: could not connect to server: No such file or directory
	Is the server running locally and accepting
	connections on Unix domain socket "/tmp/.s.PGSQL.5432"?
```

얼마전까지만 해도 잘만 됬었는데 이것 때문에 하루를 날려버렸다.

이것저것 시도했는데 하나도 되지 않다가 아래와 같이 해결했다. ~~그냥 싹 다 날렸다.젠장~~😫

- stackoverflow에 있는 별의별거 다 해봤는데 작동 하지 않음
- 일반 `brew uninstall postgres` 작동하지 않음
- 관련된 모든 디렉토리 파일들 제거 후 작동함

일반 uninstall로는 작동하지 않았고 아예 폴더랑 하위 파일들까지 전부 날려버렸다. 어차피 뭐가 없는 로컬데이터이기도 했고; user 세팅해야 하는 번거로움만 늘었다.

[참고사이트](https://search-and-deploy.gitlab.io/bits/brew-uninstall-postgresql/)

### 인스턴스 확인

```bash
$ launchctl list | grep -i sql

# 78	homebrew.mxcl.mysql@5.7
# 1	homebrew.mxcl.postgresql
# 78	homebrew.mxcl.mysql
```

### Stop

```bash
$ brew services stop postgres
```

### Postgresql과 관련 파일 제거

```bash
$ brew uninstall --force postgres
$ rm -rf /usr/local/var/postgres
$ rm -rf .psql_history .psqlrc .psql.local .pgpass .psqlrc.local
$ brew cleanup
```

### 확실히 지워졌는지 확인

```bash
$ brew list | grep sql
```

### 재설치

```bash
$ brew install postgresql
```

<br>

**잘된다 ;;**