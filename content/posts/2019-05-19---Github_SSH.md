---
title: "Github에 SSH 추가하기"
date: "2019-05-19"
template: "post"
draft: false
slug: "/posts/Github에 SSH 추가/"
category: "Github"
tags:
  - "SSH"
  - "Github에 SSH 추가"
  - "Github"

description: "Github에 SSH 추가하기"
---

Git과 Github에 익숙하지 않았고 뭘 어떻게 사용하고 관리해야 하는지 몰랐을 때가 있었다.

그래서 계정도 여러개를 만들었고 중구난방 이곳저곳으로 흩어져 있었다.

이제 어느정도 Git에 익숙해졌기 때문에 앞으로의 커리어를 정리하고 포트폴리오를 만드려고 한다.  
따라서 모든 Git 활동을 yohanpro@yohanpro.com의 깃헙으로 통일하려고 한다.

이럴 경우 문제가 되는게 push를 할 경우
<br>
<br>
![error](/media/images/ssh/error.png)

**access right**를 뱉어내며 권한이 없다고 한다.

당연히 Github는 서로 다른 계정이 push를 하려고 하니 동일인인지 확인하지 않고 repository에 push를 허용할 수는 없다.  
따라서 지금 push 하려고 하는 사람이 접근 권한이 올바르게 있는지 확인하기 위하여 <span class="color--red">SSH</span>라는 수단을 사용한다.

현재 내 yohanpro 계정에는 이미 SSH 키가 생성이 되어 있다. <br>
다만 나는 이 SSH말고 회사에서도 내 계정에 푸시를 하기 위해서 또 다른 SSH키가 필요하다. <br>
사용하기 위해서 이 계정에 id_rsa SSH키가 있는지 살펴본다.

<div class="colorscripter-code" style="color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; position:relative !important; overflow:auto"><table class="colorscripter-code-table" style="margin:0; padding:0; border:none; background-color:#272727; border-radius:4px;" cellspacing="0" cellpadding="0"><tr><td style="padding:6px 0"><div style="margin:0; padding:0; color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; line-height:130%"><div style="padding:0 6px; white-space:pre; line-height:130%">ls&nbsp;<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>al&nbsp;~<span style="color:#0086b3"></span><span style="color:#ff3399">/</span>.ssh</div></div></td><td style="vertical-align:bottom; padding:0 2px 4px 0"><a href="http://colorscripter.com/info#e" target="_blank" style="text-decoration:none; color:white"><span style="font-size:9px; word-break:normal; background-color:#4f4f4f; color:white; border-radius:10px; padding:1px">cs</span></a></td></tr></table></div>

만약 출력되는게 없다면 새로운 키를 생성해주자.
내 경우에는

<div class="colorscripter-code" style="color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; position:relative !important; overflow:auto"><table class="colorscripter-code-table" style="margin:0; padding:0; border:none; background-color:#272727; border-radius:4px;" cellspacing="0" cellpadding="0"><tr><td style="padding:6px 0"><div style="margin:0; padding:0; color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; line-height:130%"><div style="padding:0 6px; white-space:pre; line-height:130%">ssh<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>keygen&nbsp;<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>t&nbsp;rsa&nbsp;<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>C&nbsp;“yohanpro@yohanpro.com”</div></div></td><td style="vertical-align:bottom; padding:0 2px 4px 0"><a href="http://colorscripter.com/info#e" target="_blank" style="text-decoration:none; color:white"><span style="font-size:9px; word-break:normal; background-color:#4f4f4f; color:white; border-radius:10px; padding:1px">cs</span></a></td></tr></table></div>

비밀번호는 알아서 생성해주면 된다.
잘 생성되었다면
<br>
<br>
![error](/media/images/ssh/success.png)

위와 같이 ssh 파일이 생성된다.

그리고 잘 생성된 ssh 키 파일을

<div class="colorscripter-code" style="color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; position:relative !important; overflow:auto"><table class="colorscripter-code-table" style="margin:0; padding:0; border:none; background-color:#272727; border-radius:4px;" cellspacing="0" cellpadding="0"><tr><td style="padding:6px 0"><div style="margin:0; padding:0; color:#f0f0f0; font-family:Consolas, 'Liberation Mono', Menlo, Courier, monospace !important; line-height:130%"><div style="padding:0 6px; white-space:pre; line-height:130%">eval&nbsp;“$(ssh<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>agent&nbsp;<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>s)”ssh<span style="color:#0086b3"></span><span style="color:#ff3399">-</span>add&nbsp;~<span style="color:#0086b3"></span><span style="color:#ff3399">/</span>.ssh<span style="color:#0086b3"></span><span style="color:#ff3399">/</span>id_rsa</div></div></td><td style="vertical-align:bottom; padding:0 2px 4px 0"><a href="http://colorscripter.com/info#e" target="_blank" style="text-decoration:none; color:white"><span style="font-size:9px; word-break:normal; background-color:#4f4f4f; color:white; border-radius:10px; padding:1px">cs</span></a></td></tr></table></div>

해서 에이전트에 추가를 해 준 후
Github ssh 추가에서 넣어주면 된다.

![error](/meida/images/ssh/github-ssh.png)
<small class="caption" >그대로 붙여넣어 주자.</small>

![error](/meida/images/ssh/github-ssh-2.png)

잘 추가된 것을 볼 수 있다.

이제 Github에 push를 해보면 push가 잘 된다.
![error](/meida/images/ssh/ssh-success.png)
