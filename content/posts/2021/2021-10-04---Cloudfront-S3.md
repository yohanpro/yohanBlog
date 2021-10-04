---
title: Cloudfront+S3+Route53 도메인으로 배포해보기 
date: "2021-10-04"
template: "post"
draft: false
slug: "/posts/aws/20211001-cloudfront"
category: "aws"
tags:
  - "Cloudfront"
  - "S3"
  - "Route53"
  - "배포하기"
  - "access denied error"
description: 정적파일을 Cloudfront로 배포해보자.
---
지금 내 개인 토이 프로젝트를 런칭하기 위해서 정적호스팅을 해야 한다. 

Backend와 Frontend 둘 다 배포를 해야 하는데 일단 프론트 코드 배포환경 먼저 구성하기로 하였다. 

## 프론트 코드에서 배포 스크립트 추가하기

package.json

```json
// package.json
"deploy:dev": "NODE_ENV=development yarn build && aws s3 cp --source-region ap-northeast-2 --recursive dist s3://donghang-develop --acl public-read",
```

위에처럼 developement 환경을 구성하고 명령어를 설정하면 환경에 맞게 aws s3 파일에올라간다. 

![screen 3.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/1.png)

제대로 올라가는 걸 볼 수 있다. 만약에 권한때문에 제대로 안된다면 엑세스키와 아이디가 `./aws/credentials`에 제대로 들어갔는지 확인해야 한다. 

```bash
$ export AWS_PROFILE=donghang
```

그리고 위와 같이 export를 해주고 나서 접근하면 제대로 들어간다.

## S3 버킷 생성

나는 danghang.net이라는 도메인을 구입해서 진행하고 있다. 그리고 www를 붙인 것과 붙이지 않은 것 둘다 사용할 것이다. 그러므로 두 개의 버킷을 만들어서 www가 아닌 것은 리다이렉트를 해주면 된다. 

![screen 19.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/2.png)

www가 붙은 파일은 아래와 같이 퍼블릭으로 설정을 해주어야 한다. 

![screen 20.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/3.png)

### 정책 설정

이 버킷은 엔드포인트로 설정할 것이기 때문에 S3 버킷 정책을 넣어줘야 한다. 정책생성기를 누르고 정책을 업로드 해줘야 한다. 

![screen 22.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/4.png)

정책편집기를 누르면 다음과 같은 창이 뜨는데 GetObject가 필요하고 arn을 붙여넣고 생성해준다. 

![screen 23.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/5.png)

그리고 `/*`를 붙여야 하는걸 잊지 말자. 

### 정적호스팅 및 리다이렉트 설정



www가 붙어있는 폴더의 경우 정적 웹사이트 호스팅을 해준다.  아닌 S3의 경우에는 redirect 설정을 해준다.

<div style="display:flex; margin-bottom: 3rem;">
<img style="width: 40%;"src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/6.png">
<img style="width: 40%;"src="https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/7.png">


</div>

> 이렇게 되면 일단 S3 정적호스팅 준비는 끝이 났다.


## SSL 인증을 위한 AWS Certificate 생성

지금 바로 Route 53에 가서 A record로 등록할수도 있겠으나 SSL인증 + Certificate를 등록해 주어 https로 사용할 것이기 때문에 우선 등록해준다. 

여기서부터 나는 도메인을 구입했기 때문에 이를 기준으로 작성한다.

**AWS Certificate Manager** → 인증서 요청

 SSL을 AWS Certificate에서 바로 사용하려면 Region을 us-east-1 (미국 동부 버지니아 북부)에서 요청해야 한다. 

![screen.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/8.png)

아래와 같이 추가해준다.

![screen 27.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/9.png)

아래에서는 포스팅을 위해 캡쳐한 것인데 AWS에서 도메인을 구입했고 리전이 us-east-1이라면 route53에 바로 연결할 수 있다. 

![screen 28.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/10.png)

> 이렇게 연결이 끝났으면 SSL로 사용하기 위한 준비는 끝이 났다.
> 

## Cloudfront 연결하기

S3에 cloudfront를 연결해보자.  아래는 cloudfront 설정이 끝난 모습이다. 

![screen 1.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/11.png)

배포 생성 → 원본 도메인 이름 설정

원본 도메인(S3에 있는 버킷)과 이름을 설정해줘야 한다. 예전에는 알맞게 들어가지 않는 경우가 있었으나 요즘에는 원본 도메인을 클릭하면 이름도 잘 들어간다.

![screen 2.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/12.png)

나머지는 크게 건드릴게 없다. SSL 설정을 해줬기 때문에 https로 리다이렉트해준다.

![screen 3.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/13.png)

설정에서 CNAME을 설정해준다.  SSL인증서는 잘 생성했다면 드롭다운에 나타난다.

![screen 4.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/14.png)

## ‼️Cloudfront에서 접근 오류가 나는 경우

이 문제가 해결이 안되서 몇일을 고민했는데 방법을 치호님이 알려주었다. 😳

근데 이게 근본 해결같지는 않고 우회적은 해결같은 느낌이 있다. 

현상을 해결하지 말고 원인을 해결하라

**문제: access denied 발생**

S3 정책설정도 다 퍼블릭으로 해줬는데도 루트 페이지로 가면 access denied가 뜨는 오류가 있다.

짜증나는건 루트페이지에서만 오류가 나고 하위 페이지에서는 오류가 나지 않는다는 것이다.

![screen 6.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/16.png)

나를 짜증나게 만들었던 루트 페이지 access denied

참  짜증나는 일인데 아래와 같이 오류페이지 처리에서 리다이렉트로 보내주면 된다.

![screen 5.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/15.png)

배포 성공!

![screen 7.png](https://yohanproblogasset.s3.ap-northeast-2.amazonaws.com/images/20211004/17.png)