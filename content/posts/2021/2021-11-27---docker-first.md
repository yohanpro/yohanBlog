---
title: 도커 튜토리얼 해보기
date: "2021-11-27"
template: "post"
draft: false
slug: "/posts/docker/tutorial"
category: "docker"
tags:
  - "docker"
  - "docker-compose"
  - "도커"
  - "docker start"
  - "docker tutorial"
  - "도커 튜토리얼"
description: 도커 튜토리얼 문서 따라해보기
---

내 주된 기술 부채중 하나는 도커였다. 도커를 그동안 백엔드의 영역이고 거의 만질일이 없다고 생각했기 때문에 배우는 걸 뒤로 미뤄뒀었다. 
하지만 해보고 싶은 일이 생겼기 때문에 docker를 배워보고자 하였다. 

## 공부하기 전, 내가 docker에 대해 알고 있는 것(혹은 이런거라고 알고 있는 것)

<br>

docker가 나온이유 : 
- 매번 똑같은 세팅을 하기가 귀찮은 것
- 배포를 할때 AWS 우분투 → pm2 설치, typeorm, mysql, python...등등
- AWS ssh key 같은 것들도 다 .ssh 파일에 저장해야 함. ->  이런거를 자동화시킬 수 없을까? -> 도커 탄생


--- 

- 쿠버네티스라는게 있고 도커와 관련이 있다.
- docker에는 Contianer라는 개념이 있다.
- 이미지라는 것도 있음. 
- yml형식으로 작성된 도커파일이 있다.

대략 이 정도를 알고 있는 것 같다. 

## 내가 docker로 하고싶은 것

예를 들어본 상황인데, 현재 상황이나 마찬가지다.

- 신입이 들어왔을때 새로운 맥북을 지급받았다
- 그러면 회사업무에 필요한 프로그램들을 다 설치해야 한다.
- vscode, microsoft teams, nodejs, nvm, aws cli. azure, postman, homebrew 등등
- 이런 세팅들을 전부 한번에 해버리고 싶은거
- 그럼 신입일 경우를 가정하지 않더라도 내가 나중에 맥북을 이전할때 docker run 등의 커맨드를 쳐서 알아서 쫙~ 하면 좋지 않을까?

가능한지 안가능한지 지금으로서는 잘 모르겠다. 일단 튜토리얼부터 따라해보자.

## 블로그에서 다룰 범위와 참고 사이트




## 그래서 도커란?

이제부터 여기서 나오는 용어들이나 설명들은 도커 공식블로그만 참고 번역해서 쓴 글이다. 

**도커 :** 어플리케이션을 개발, shipping(용어 자체만 보니 정말 물류 배송같다.), 실행하기 위한 open platform이다. 인프라 단에서 분리하여 서비스를 빠르게 제공할 수 있다. 도커 환경을 잘 이해하고 사용할 수 있다면 코드를 작성하는 것과 배포 production 환경에서의 지연을 크게 줄일 수 있다.

말은 어렵지만, 결국 통일성과 표준이다. 서버코드를 올리고 인프라단에서 설치 및 배포하는 환경에서 (버전이 안맞거나 등) 나타나는 괴리들을 직접 경험해본 사람들이라면 왜 필요한지 알 수 있다. 도커는 이런 문제점들을 빠르게 해결해 준다. 

## **컨테이너와 이미지** 
![container-what-is-container.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/container-what-is-container.png)



- 이미지 : 도커 컨테이너를 생성하는 지침이 포함된 템플릿이다. Dockerfile등 yml로 만들거나 하여 공유할 수 있다.  AWS에서 인스턴스를 백업할때 만들어본 경험이 있다면 이미지의 개념이 어느 정도 감이 온다. 

- 컨테이너 : 이미지의 실행가능한 인스턴스이다. docker 데스크탑이나 CLI등으로 docker API를 다룰 수 있다. 격리라는 말을 강조하고 있는데. 각각의 컨테이너는 모두 독립된 환경이 기본이며, 이를 네트워킹등을 사용해서 사용할 수 있다. 

---

## 도커 설치하기

> 🤔 개인적으로 brew보단 공식홈페이지 다운로드 설치를 추천한다.

brew cask로 설치할 수도 있는데, `brew cask로 설치` 하는 것과 그냥 `brew install`는 차이가 있다. `brew install`만 할 경우  → vitrual machine가 추가로 설치 필요하며 뿐만 아니라, compose, machine등을 설치해야 한다.

brew cask로 하면 virtual machine을 사용하는 것이 아니고 맥OS 자체에서 docker desktop 응용프로그램을 띄우는 방식으로 사용하게 된다.

brew로 삽질하다가 느낀 것은 때로는 brew보다 공식홈페이지에 있는 파일을 다운로드를 하는게 더 나을 때도 있다는 것이다.
도커의 경우 pkg파일을 다운받고 실행하면 바로 실행할 수 있는 Docker Desktop이 설치된다. 이걸 실행하기만 하면 된다.

## 무작정 튜토리얼 따라하기:  도커 공홈에 있는 todo list 해보기

도커 todo list를 사용한 starter 튜토리얼을 제공하고 있다. 
[getting-started/app at master · docker/getting-started](https://github.com/docker/getting-started/tree/master/app)

위 주소에서 clone해서 받아보자 그리고 docker file 튜토리얼을 만든다.

### dockerfile을 만들고  작성해보자.

```docker
# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

이제 터미널로 다음과 같은 명령어를 쳐보면 image가 만들어진다...고 되어있지만 뭘 설치하란다

```bash
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

여기 아래에 따라 docker가상머신도 만들어주고 시도해보장

[[Docker] Homebrew로 Mac에 도커 설치](https://dc7303.github.io/docker/2019/11/24/dockerInstallForMac/)

이런 방식으로 열심히 설치를 했다. 하지만, 삽질하다가 발견한 것이지만,  ... 위 방식대로 했다면 docker 응용프로그램이 설치되어 있을 것이다. 이를 실행시켜주기만 하면 된다..

```bash
$ docker build -t getting-started .
```

명령어로 이미지를 만들어주고 

```bash
$ docker run -dp 3000:3000 getting-started
```

위의 명령어로 3000번 포트에서 돌려보자.

-dp는 분리된모드(즉 백그라운드에서 실행하고 호스트 port 3000번 사이에서 매핑을 해준다)에서 실행을 하고 있는 것을 볼 수 있다. 

![screen.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen.png)



- 도커 버전 업데이트

static/app.js를 업데이트 하고 아래와 같이 하면 오류가 나온다. 기존에 있던 도커 컨테이너를 삭제하고 다시 업데이트 해야한다.

### 도커허브 이용하기

github처럼 도커허브도 push가 가능하다. docker hub에 가입하고 

```bash
$ docker login -u yohanpro
```

```bash
$ docker push yohanpro/getting-started
```

위와 같이 push가 가능하다. 

### 데이터 유지하기 : Volume 
- 도커가 시작되면 같은 컨테이너를 사용한다고 하더라도 리셋이 된다. 리셋해도 데이터가 유지되려면 Volume이라는게 필요하다. 

> Volumes provide the ability to connect specific filesystem paths of the container back to the host machine. If a directory in the container is mounted, changes in that directory are also seen on the host machine. If we mount that same directory across container restarts, we’d see the same files.

There are two main types of volumes. We will eventually use both, but we will start with named volume

- 뭔말이냐면 결국 Volume이라는 걸 통해서 컨테이너가 마운트되면 다른 machine에서도 볼 수 있다는 뜻이다.

그럼 이 Volume이라는 걸 어떻게 만드냐? Volume을 만드는건 간단하다. 

```bash
$ docker volume create todo-db
```

이제 커맨드에 -v를 붙여 Volume을 만들고 db를 붙인다.

```bash
$ docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started
```

이렇게 되면 컨테이너를 제거하고 동일한 이미지에서 시작한다고 하더라도 기존 데이터가 남아있는 것을 볼 수 있다.

![screen 1.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+1.png)

## 여러개의 컨테이너를 사용하기

- mysql을 설치하고자 할때 하나의 컨테이너에 담는 것은 추천하지 않는다.
- 각각의 컨테이너는 하나만 하는게 좋다
- 우리가 생각해봐도 처음엔 하나의 서버에 다 있는게 좋지만, 확장할때 DB서버를 분리하지 않는가?

장점은 아래와 같이 있다.

- API서버와 프론트엔드 서버를 데이터베이스와 다르게 확장해야할 가능성
- 여러 프로세스를 실행하려면 프로세스 관리자가 필요하다.

### 네트워킹하기

- 컨테이너들은 하나의 독립된 환경이기 때문에 서로 정보를 모른다. networking이라는 것을 통해서 통신할 수 있다.

<aside>
🤧 두개의 컨테이너가 하나의 네트워크에 있다면 통신가능함

</aside>

```bash
$ docker network create todo-app
```

그리고 mysql 서버를 시작한다.

```bash
$ docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:5.7
```

여기 있는 옵션들을 정확히는 잘 모르지만 대충 읽어보면 mysql을 volume을 붙여 시작한다는 것 정도는 알수  있다.

그리고 아래 명령어로 mysql이 제대로 생성되었는지 확인할 수 있다.

```bash
$ docker exec -it <mysql-container-id> mysql -u root -p
```

![screen 2.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+2.png)

### `nicolaka/netshoot` 사용하기

- 위에서 말한대로 같은 네트워크상에 있는 컨테이너들끼리는 통신할 수 있다. 그런데 어떻게 찾느냐?
- 이 라이브러리는 이 기능을 도와준다.

```bash
$ docker run -it --network todo-app nicolaka/netshoot
```

수~ 많은 명령어들이 있지만 일단 튜토리얼이므로 넘어간다.

### mysql 서버 및  실행

```bash
$ docker run -dp 3000:3000 \
   -w /app -v "$(pwd):/app" \
   --network todo-app \
   -e MYSQL_HOST=mysql \
   -e MYSQL_USER=root \
   -e MYSQL_PASSWORD=secret \
   -e MYSQL_DB=todos \
   node:12-alpine \
   sh -c "yarn install && yarn run dev"
```

위 명령어로 mysql서버, 볼륨, networking을 포함해서 도커 run을 할 수 있다.  알아두어야 할점 중 하나는 

우리가 보통은 dotenv같은 라이브러리나 env를 사용해 환경변수를 편집하는데 이는 도커에서 바람직하지 않다고 말한다.

이와 관련된 내용은 아래 블로그에 있다.

[Why you shouldn't use ENV variables for secret data](https://diogomonica.com/2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/)

여하튼 실행하면 다음과 같이 잘 실행하고 있는지 logs 명령어로 볼 수 있다. 

```bash
$ docker logs <컨테이너 ID>
```

![screen 3.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+3.png)

그리고 3000번 포트로 브라우저에 접근해서 아이템 추가하면 mysql DB에 들어가게 된다. 

추가하고 확인해보자(예제로 올려놓은 파일은 utf-8 인코딩 처리가 안되어있으므로 한국어 입력시 오류가 난다. )

```bash
$ docker exec -it <컨테이너 id> mysql -p todos
```

![screen 4.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+4.png)

오 제대로 들어갔다!

## docker compose

도커 작성?

도커 compose는 여러개 컨테이너 어플리케이션을 정의하고 공유하는데 필요한 도구이다. YAML 파일들을 많이 볼 수 있는데 이를 생성할 수 있다. 가장 큰 장점은 Application 스택들을 기술해놓고 프로젝트 저장소 root에 보관하고 , 다른 사람들이 기여하기 쉽다는 점이 있다.

이렇게 글로만 작성해놓으면 하나도 모르겠다. 지금까지 튜토리얼에서는 아래와 같이 도커를 실행했었다.

```bash
# node server
$ docker run -dp 3000:3000 \
  -w /app -v "$(pwd):/app" \
  --network todo-app \
  -e MYSQL_HOST=mysql \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=secret \
  -e MYSQL_DB=todos \
  node:12-alpine \
  sh -c "yarn install && yarn run dev"

# mysql
$ docker run -d \
  --network todo-app --network-alias mysql \
  -v todo-mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=todos \
  mysql:5.7
```

이미 느꼈지만 어떤 대단한 개발자라도 이걸 일일이 치고 있지는 않을 것이다. severless에서도 사용했었지만 도커에서는 yml 파일을 작성하면 된다. 위 명령어를 옮기면 다음과 같다.

```yaml
version: '3.7'
services:
  app:
    image: node:12-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - "3000:3000"
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos
  
  volumes:
    todo-mysql-data:
```

이제 작성한걸 돌리면 된다. -d 플래그를 붙이면 백그라운드에서 실행한다는 의미이다. 

```bash
$ docker-compose up -d
```

![screen 5.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+5.png)

오.. 실행된다. 그리고 지금까지는 독립적으로 존재했던 컨테이너들과는 다른 모습이다.  그룹핑이 되어있다. 

![screen 6.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211127/screen+6.png)

그리고 이전 튜토리얼에서 배웠던 것과 달리 네트워크를 지정하지도 않았는데 알아서 네트워킹이 되어있다.

이걸 끄려면 `docker-compse down`명령어를 쓰면된다. 주의해야할 점은 named volume은 삭제되지 않는다. 따라서 지우고 싶다면 `--volumes` 태그를 붙여야 한다.


## 끝내며

도커 튜토리얼을 따라해봤다. 도커 튜토리얼 자체는 굉장히 이해하기 쉽고, 우리가 앞으로 도커에서 할 것들, 할 수 있는 것들에 대한 기본 지식들을 거의 다 알려준다.  

이제 나는 이 튜토리얼을 생각하고, docker를 통해 실제 해보고 싶은 것들을 서비스 하는 연습을 하면 될 것 같다. 추상적으로 이해하고 있는 부분들은 토이프로젝트를 통해서 가다듬어지기 마련이다. 역시 뭐든지 장난감들을 많이 만들어보고 망가뜨려봐야 한다. 