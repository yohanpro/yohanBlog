---
title: (NodeJS)Google OAuth를 활용한 로그인 페이지 만들기  
date: "2019-12-22"
template: "post"
draft: false
slug: "/posts/codereview"
category: "codereview"
tags:
  - "코드리뷰"
  - "NodeJs"
  - "MySQL"
  - "JS"
  - "BackEnd"
  - "API 구축"
description: "Google OAuth를 활용한 로그인 페이지 만들기"
---
<style>
.bigger{
  font-size:1.2em;
  font-weight:bold;
}
.blue{
  color:#8377D1;
}
</style>
1. 만들게 된 이유 배경
2. 코드리뷰 할 것
프론트는 퍼블리싱 한것을 그대로 만듬
구글 로그인 과정 (O auth 설명)
- id token과 access token 설명
- jsonwebtoken
DB 구성 및 개요
백엔드 구성
 - route는 어떻게?
 - 파일 올리기 multer 
 - dropzone에서 올린 파일 주고 받기
 - 카드 업데이트 고민

최종 평가
- 미흡한 점
- 잘된 점


 ## 프로젝트의 목적과 배경

주로 프론트 작업만(거의 퍼블리싱 수준의 작업)만 하던 내게 첫 백엔드 & DB 작업이 주어졌다.

맡은 프로젝트의 목적은 회사 내부 프로젝트이며, 고객들에게 우리가 가진 역량과 전문성을 보여주고자 
회사 내부 프로젝트로 카드뉴스를 고객사에게 정기적으로 보내준다.
나는 그것을 관리하는 프로젝트 중 Admin 페이지의 Backend와 DB를 만들어야 하며 또한 Front 페이지에서 API를 받아오는 부분이다. 

처음 임무를 받을 때는 볼륨이 작은 튜토리얼 정도로 생각했었지만, 이게 생각보다 훨씬 고민해야 되는 부분이 많았고 고생도 많이 했다. 

다만 이 블로그는 전체에게 공개되는 공간이기에 전체 코드를 올릴 수가 없고 한정된 내용의 코드만 포스팅하기로 하였다.

## 작업 설명 (개괄)

1. <span class="bigger">Front 기초 페이지</span> <br>
 프론트 페이지는 만들어져 있는 템플릿을 그대로 가져다 썼다.
구글에 admin 페이지 템플릿을 치면 나오는 것이 여러가지가 있는데 그 중 하나를 팀원분이 맡아주시고 기초 JS 작업을 해주셨다.
하지만 템플릿은 템플릿이고 결국 API를 받아오거나 자료를 보내주는 부분은 내가 해야하는 작업이었다.

2. <span class="bigger">Google Oauth 2.0을 사용한 Admin 페이지 로그인</span><br>
회사가 Google G-Suite를 사용하기 때문에 우리 회사는 Google Drive, Gmail 등을 사용하고 있다. 그래서 별도의 로그인과정을 거치지 않고 Google에서 사용하는 O-auth를 사용하였다.

3. <span class="bigger">DataBase 구성(Mysql)</span><br>
  DB는 만들어 본 적이 없다. mysql을 작성할때는 팀장님이나 Google을 적극 이용했다.
  하지만 DB의 기초도 제대로 모르고 설계하느라 중간에 구조를 바꾸는 일이 종종 발생했고 설계미스도 많았다.

4. <span class="bigger">Backend 작업</span>
  당연히 내게 익숙한 Node.js를 사용한다. 그리고 요즘 Node.js서버를 사용할 때 거의 필수적인 express를 사용했다. 서버는 회사에서 사용하고 있는 AWS EC2인스턴스를 사용하고 nginx를 사용해 도메인을 나누었다.


## 들어가는 기능 설명

정말 여러가지 기능들이 있지만 블로그에 포스팅 할 내용만 간추려서 정리해보면

- 구글 login, logout 기능
- Dropzone을 이용한 이미지 드래그드랍하여 올리는 기능
- 올린 이미지들을 순서에 맞게 정렬, 삭제하는 기능


## 구글 로그인 Oauth 2.0을 사용하여 로그인 해보기

Oauth는 워낙 유명하다. 요즘은 쇼핑앱을 들어가게 되면 다음과 같이 소셜로그인 기능을 볼 수 있다.

![소셜로그인](/media/images/innoboost/admin/social.jpg)

즉  Oauth 기능은 간단히 설명해보면 아래와 같다. <br>
1. 어떤 사용자가 우리의 서비스를 이용하려 한다.
2. 그런데 이 사용자가 정말 올바른 권한을 가졌는지 확인해보려고 한다.
3. 이 때 구글 등 이미 이 사용자가 회원가입한 서비스에서  "이 고객은 우리가 신원을 보증하니 통과시켜도 됩니다."라고 말해준다.
4. 우리는 구글에서 신원을 인증해주니 우리의 자원들을 사용할 수 있는 권한을 부여해준다.


정리하면 이런데, 그렇다면 생각해보면 아래와 같은 절차가 필요하다.

- 우리의 Front 웹사이트(도메인)를 구글에다가 알려줘야 한다. 이 Front 사이트에서 구글에 요청을 하게 되면 구글 API에서 적합한 권한을 가지고 있는지 판단해준다.
- 구글 서버로부터 Front 페이지는 <span class="blue">id token</span>과 <span class="blue">access token</span>을 받아온다.
- 우리의 프론트 페이지는 받아온 id, access token을 우리의 서버로 보내준다.
-  우리 서버는 구글에 id token이 유효한지 체크해준다.
-  id token의 유효성을 검증하게 되면 구글에서 Validate 응답을 보내주고 
- 우리 서버가 프론트 페이지에게 응답(200코드)을 보내준다.
- 200코드를 확인하게 되면 메인 홈페이지로 넘어간다.


## 프론트 페이지 코드


google oauth는 사실 따로 설명할 필요도 없이 구글에서 잘 설명을 해놨다. 아래 홈페이지를 참고하자.<Br>
[Google Oauth Sign In tutorial](https://developers.google.com/identity/sign-in/web/sign-in)


```js
   <input type="button" class="button" value="">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
```

우선 Html에서는 버튼을 만들어 주고 여기에 구글에서 제공하는 라이브러리를 붙여준다.

```js
 let gauth;
 const xhr = new XMLHttpRequest();
 let loginBtn = document.querySelector('.button');
 loginBtn.addEventListener('click', login); //이어서 설명
```

Jquery를 사용한다면 `$.ajax()`를 사용할 수도 있겠지만 위의 경우는 튜토리얼을 참고했고 vanila로 XMLHttpRequest의 인스턴스를 만들어서 사용한다.

```js
function login() {
  gapi.load('auth2', function () {
      gauth = gapi.auth2.init({
          client_id: 'Your Client id를 넣어주세요'
      });

      gauth.signIn().then(result => {
          let user = gauth.currentUser.get();
          let userName = user.getBasicProfile().getName();
          let userInfo_it = result.getAuthResponse().id_token;
          let userInfo_at = result.getAuthResponse(true).access_token;

          xhr.open('post', 'http://localhost:8080/auth/login', true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.onreadystatechange = function () {
              if (xhr.readyState === xhr.DONE) {
                  if (xhr.status === 200 || xhr.status === 201) {
                      let payload = JSON.parse(xhr.responseText);
                      window.location.href = './next.html';
                      localStorage.setItem('token', payload.token);
                      localStorage.setItem('name', userName)
                  } else {
                      console.error(xhr.responseText);
                  }
              }
          };
          xhr.send("it=" + userInfo_it + "&at=" + userInfo_at);
      });
  });
}

```

google에서 제공하는 signIn의 경우 프로미스를 리턴하고 리턴 받은 값을 console로 확인해보면 여러가지 정보들을 확인할 수 있다. 
정보들은 아래 정보들인데 
[gapi.auth2.AuthResponse](https://developers.google.com/identity/sign-in/web/reference#gapiauth2authresponse);

<img style="width:90%;" src= "/media/images/innoboost/admin/authResponse.png" /><br>
이 중 중요한 것은 당연히 <span class="blue"> id token</span>과
 <span class="blue">access token</span>이다. 하지만 만약 구글에 있는 기타 서비스들을 사용하지 않고 로그인 기능만 필요하다면 access token은 굳이 필요하지 않다.

위의 코드에서 xhr을 통해 응답코드 200을 받아오게 된다면 필요한 정보들<small>(예를 들어 jswon token)</small>을 클라이언트에서 가지고 있다가 나중에 header에 붙여주는 방식으로 사용할 수 있다. 

jwt를 로컬 스토리지에 저장하면 안된다?는 내용의 글들을 여럿 보았다. 
하지만, 만드는 프로젝트가 일단 그렇게 개인정보에 민감할 정도로 중요한 사이트가 아니었고, 내부의 일부 인원만 사용할 사이트이기 때문에 localstorage에 저장했다.

## Backend 서버 처리코드 

이제부터 설명할 내용은 서버측에서 처리할 내용이다. <br>
[Google signin Backend](https://developers.google.com/identity/sign-in/web/backend-auth)<br>
Node를 사용한다면 npm package 중에서 `google-auth-library`를 사용하면 된다.<br>
```js 
const {
	OAuth2Client
} = require('google-auth-library');

const client = new OAuth2Client('구글 클라이언트 id');
const connection = require('../db/mysql');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: req.body.it
		});
		const payload = ticket.getPayload();
		const userid = payload['sub']; //21자리의 Google 회원 id 번호

		connection.execute('SELECT `TOKEN` FROM `innoboost_user` WHERE `ID`= ?', [userid], (err, results) => {
			if (err) throw err;
			let token = '';
			if (results.length > 0) {
				console.log('DB에 있는 유저', results);
				token = updateToken(payload);
			} else {
				console.log('DB에 없는 유저');
				//새로 유저를 만들면 jwt 토큰값을 받아온다.
				token = insertUserIntoDB(payload);
			}
			res.send({
				token
			});
		});
	}
	verify().then(() => {}).catch(console.error);
});
```
굳이 router를 세분화해서 연결하는 과정까진 적지는 않았다.

설명을 하면 Google 라이브러리를 통해서 유저를 verify한후 jwt를 생성해준다. 생성된 토큰은 res.send로 보내주준다.
만약 로그인 한 사람이 DB에 저장된 사람이라면 DB에 token만 업데이트를 해주고, 
DB에 없다면 토큰을 만들어주고 돌려준다.



```js
const updateToken = (payload) => {
	const {
		sub,
		name,
		email
	} = payload;
	console.log(`id: ${sub}\n name:${name}\n, email:${email}`);
	const token = jwt.sign({
			id: sub,
			name,
			email
		},
		JWT_SECRET
	);

	connection.execute('UPDATE `innoboost_user` SET `TOKEN`= ? WHERE (`ID`= ?)', [token, sub], (err, results) => {
		console.log(results)
	});
	return token;
}

const insertUserIntoDB = (payload) => {
	const {
		sub,
		name,
		email
	} = payload;
	console.log(`id: ${sub}\n name:${name}\n, email:${email}`);
	const token = jwt.sign({
			id: sub,
			name,
			email
		},
		JWT_SECRET
	);

	connection.execute(
		'INSERT INTO `innoboost_user` (ID, EMAIL, NAME, TOKEN) VALUES (?, ?, ?, ?)',
		[sub, email, name, token],
		(err, results, fields) => {
			if (err) {
				console.log('fail');
				throw err;
			}

		}
	);
	return token;
};

```

DB에서는 이제 유저를 처리해 준다. 우리에게 필요한 것은 ID, EMAIK, Token, NAME 정도인데,
토큰은 앞으로 Front에서 유저가 API를 호출하면 JWT로 유효한 접근인지 확인하여 걸러주게 될 것이다.

다음 포스팅 내용에서는 이제 힘들었던 multer와 Dropzone.js를 사용한 파일 올리기를 리뷰해보도록 하겠다.