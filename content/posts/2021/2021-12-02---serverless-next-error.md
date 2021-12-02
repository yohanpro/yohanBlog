---
title: sls-next/serverless ResourceConflictException lambda 에러
date: "2021-12-02"
template: "post"
draft: false
slug: "/posts/aws/serverless-next-error"
category: "programming"
tags:
  - "serverless"
  - "@sls-next/serverless-component"
  - "ResourceConflictException"
  - "The operation cannot be performed at this time. An update is in progress for resource:"
  - "서버리스 배포 에러"
description: sls-next/serverless ResourceConflictException lambda 에러 해결하기
---

TL;DR:
> **@sls-next/serverless-component**를 사용하여 배포를 하고 있다면, **버전을 3.5.3 이상으로 올리면 된다.** 

---

지금껏 배포가 잘만 되던 프로젝트가 serverless 배포 오류가 발생한다. 기록을 찾아보니 9월 초까지는 배포가 정상적으로 진행이 되었는데. 어느 순간부터 갑자기 되지 않는다.



내용은 아래와 같다. 


> **ResourceConflictException:** The operation cannot be performed at this time. An update is in progress for resource: arn:aws:lambda

람다와 관련된 문제같은데 정확한 내용을 찾아보니 serverless-nextjs issue란에 아래와 같은 내용이 있다. 


[Deploy fails after opting in to new Lambda states](https://github.com/serverless-nextjs/serverless-next.js/issues/1976)


AWS lambda관련 업데이트에서 9월 6일 업데이트가 된 것이 있다. 이 업데이트는 람다 function을 생성 혹은 수정한 직후에 함수를 업데이트하는 workflow에 영향을 주기 때문에 function 업데이트를 할 때 fail이 일어날 수 있다고 한다. 

이를 해결하기 위해서는 기존에 serverless.yml 파일에 있던 내용을 바꾸어야 한다. 

```yaml
your-project-name:
  component: "@sls-next/serverless-component@1.19.0-alpha.0"
  inputs:
    nextConfigDir: "../../"
    timeout: 30

```


여기서 기존에 1.19.0으로 쓰던 것을 3.5.3이상으로 바꾸면 된다. 
```yaml
tf-fifa:
  component: "@sls-next/serverless-component@3.5.3"
  inputs:
    nextConfigDir: "../../"
```


또 하나 공식문서를 보다가 업데이트한 내용이 있다. 위처럼 yaml 파일로 배포할 경우에는 devdependency에 있는 버전은 적용이 되지 않으니 되도록 헷갈리지 않도록 삭제를 해주는게 좋다. 


[서버리스 문서](https://www.serverless.com/plugins/serverless-nextjs-plugin)
> If you specify @sls-next/serverless-component in your serverless.yml file, do not add @sls-next/serverless-component to your package.json file, it is not used and only the version in serverless.yml file is used, which Serverless pulls from npm by itself. If you do not specify the version, it will use the latest tag, which refers to the latest stable version here (i.e not alpha versions).