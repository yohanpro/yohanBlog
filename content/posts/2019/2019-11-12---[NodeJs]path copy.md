---
title: NodeJS에서 Path 사용방법
date: "2019-11-12"
template: "post"
draft: false
slug: "/posts/js/node-path"
category: "js"
tags:
  - "Node"
  - "NodeJs"
  - "Path 사용방법"
  - "JS"
description: "NodeJs에서 Path 사용해보기"
---

<style>
.green{
  color:#43853d;
  font-weight:bold;
}
.method{
 font-weight:600;
 font-size:1.2em;
}
</style>

요즘 NodeJs를 사용하여 Veeva BoilerPlate 3.0 작업을 하는 중이다.<br>
Gulp를 사용하면서 느꼈던 점이지만, path를 정확히 맞춰 구현하는 건 생각보다 짜증나는 일이다.<br>
Node에서는 이런 path들을 맞추기 위해 Path 모듈을 제공하는데, 정리하고 넘어가면 좋을 것 같아 블로깅 하기로 하였다. <br>

참고 사이트는 [Path]('https://nodejs.org/api/path.html') NodeJS v13.1.0 문서를 참고하였다.

## Path 모듈 소개

Path 모듈은 파일과 Directory 경로 작업을 위한 Utility를 제공한다.<br>

## Path모듈은 어디에 쓰이는가?

나의 경우는 개인적으로 `Create-Veeva-project`를 npm 모듈로 만들기 위해 작업중이다.<small>(11월 29일까지로 예상 만료일로 잡아놓았다.)</small><br>

내가 만드는 이 모듈은 특성상 디렉토리를 만들거나, 파일을 옮기는 등의 작업을 하는 것이기 때문에 Path에 대한 이해가 필요했다.

## Path 모듈의 주요 메소드들

Node.js v13.2의 Path 메소드는 현재 13개가 있다. 그 중에서 알아두면 유용한 메소드 몇 가지를 소개해보고자 한다.

 <h3 class="sourceSansPro method">1.path.normalize</h3>

normalize에 Path를 넣으면 알아서 경로를 normalize해서 return 해준다.

```js
const path = require("path");
let myPath = path.normalize("/this/is//a//my/.././path/normalize");

console.log(myPath); //   /this/is/a/path/normalize
```

위의 경우 ../는 상위 디렉토리로 가기 때문에 my가 생략된 것을 볼 수 있다.

<h3 class="sourceSansPro method"> 2. path.join([...paths])</h3>

path.join은 String을 주게 되면 플랫폼별(windows냐 mac이냐) 구분자를 사용해서 경로를 정규화해서 리턴해준다.

```js
const path = require("path");
myPath = path.join("/this", "is", "a", "////path//", "join");

console.log(myPath); //   /this/is/a/path/join
```

플랫폼에 따라 구분자는 달라지므로 윈도우라면 백슬래시(<span class="color--red">\\</span>)가 들어갈 것이다.

 <h3 class="sourceSansPro method">3.path.resolve([...paths])</h3>

<span class="sourceSansPro">path.resolve</span>는 <span class="sourceSansPro">path.join</span>과 <span class="sourceSansPro">path.normalize</span>를 합친 것 같은 효과이다.

이것은 주어진 문자열을 cd를 해서 최종 마지막 폴더까지 간 후 pwd(Print Working Directory)를 한 것과 동일하다.
그리고 문서에 따르면 절대 경로가 만들어질 때까지 prepend된다.

그리고 만약 주어진 path를 모두 사용했음에도 절대 경로를 못만들었다면, cwd(Current working Directory)를 사용한다.

```js
const path = require("path");
myPath = path.resolve("/this", "is/a", "../.", "path", "resolve");

console.log(myPath); //   /this/is/path/resolve

myPath = path.resolve("wwwroot", "static_files/png/", "../gif/image.gif");

console.log(myPath); //  /Users/yohan/Desktop/MyTest/wwwroot/static_files/gif/image.gif
/*
이 경우에는 주어진 값만으로는 절대경로를 만들 수 없으므로  cwd를 사용한다.
*/
```

<h3 class="sourceSansPro method">4. path.dirname(path), path.basename(path[, ext])</h3>

path.dirname은 현재 작업하고 있는 디렉토리의 이름을 출력한다.<br>
반면 path.basename은 파일이름을 출력한다.<br>
만약 basename에 옵션값을 주게 되면 뒤의 확장자를 제거할 수도 있다.

```js
const path = require("path");
myPath = path.dirname("/foo/bar/baz/asdf/image.png");
console.log(myPath); ///foo/bar/baz/asdf

myPath = path.basename("/foo/bar/baz/asdf/image.png");
console.log(myPath); //image.png

myPath = path.basename("/foo/bar/baz/asdf/image.png", ".png");
console.log(myPath); //image
```

 <h3 class="sourceSansPro method">5.path.parse(path)</h3>

path.parse는 path를 말 그대로 파싱해준다.<br>

```js
const path = require("path");
myPath = path.parse("/home/user/dir/file.txt");
console.log(myPath);
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

### 내 프로젝트

내 프로젝트는 create-veeva-project npm 모듈인데, path를 정리하지 않고 넘어갔다면 삽질을 많이 했을 것이다.

예를 들어

```js
const baseDir = "foo/bar";
const rootFolder = `${baseDir}/${options.presentation}`;
```

같이 사용하지 않더라도

```js
path.join(baseDir, options.presentation);
```

과 같은 방법으로 바꿀 수 있으니 잘 활용하면 코드의 가독성을 높일 수 있고 효율적으로 코딩할 수 있다.
