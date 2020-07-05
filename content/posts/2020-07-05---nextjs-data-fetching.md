---
title: Next.js에서 data-fetching하기
date: "2020-07-05"
template: "post"
draft: true
slug: "/posts/nextjs/data-fetching"
category: "react"
tags:
  - "nextjs"
  - "data-fetching"
  - "getServerSideProps"
  - "getInitialProps"
  - "Nextjs에서 데이터 가져오기 기법"
description: Next.js 9.3 이상 버전에서 data-fetching하는 방법을 알아보자.(getStaticProps, getServerSideProps)
---

Next.js팀 (Vercel)팀은 2020년 3월 10일에 9.3버전의 Next.js를 공개했다. 달라진 것 중에서 가장 눈에 띄는 것은 단연 data-fetcing 하는 메소드가 두 개가 추가된 것이다.

즉 pages 폴더 아래에 있는 엔드포인트 js에서 데이터를 가져올 때 기존에는 `getInitialProps`로만 가져왔던 것을 서버사이드와 SSG(Static Generation)으로 나누어서 쓸 수 있도록 만들어 놓은 것이다.

## SSG(Static Generation) vs SSR(Server-side rendering)

기본적으로 Next.js는 모든 페이지를 pre-rendering하는 기법을 취하고 있는데, 말 그대로 클라이언트사이드 js에서 작업하기 전에 미리 html을 만들어둔다. 이 Pre-rendering하는 형태가 두가지 있다. 바로 ssg와 ssr이다.

뭔 차이가 있을까? Next.js 공식문서에는 아래와 같이 나와 있다.

**Static Generation (이 방식으로 하기를 추천함):** HTML은 build-time에 만들어지고 각각 request 보낼때 재사용함 `getStaticProps`를 export해서 사용 <br>
**Server-side Rendering:** HTML이 각각 request 보낼 때 만들어짐. `getServerSideProps`를 export 하여 사용.

공식문서에서는 Static Generation으로 만들기를 적극 추천하고 있다. 그 이유는 캐싱을 해놓기 때문에 좀 더 좋은 성능을 보여줄 수 있기 때문이라고 한다.

## getStaticProps

아래와 같이 async를 사용하여 export하게 되면 Next.js에서는 빌드할 때 해당 페이지를 Pre-render한다.

```js
const Blog = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
};

export async function getStaticProps() {
  // 외부 데이터를 불러올 수 있다.
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  //  { props: posts } 이렇게 return 해주면  Blog 페이지는 빌드타임시에 post를 가져온다.

  return {
    props: {
      posts,
    },
  };
}

export default Blog;
```

### getStaticProps를 써야할 때는 언제?

- 유저가 request 하기에 앞서서 페이지를 렌더링 할때 필요한 데이터가 있을 때
- 데이터가 headless CMS로부터 올때 (이건 무슨말인지 모르겠음)
- 데이터가 공식적으로 캐싱될 수 있을 때 (특저 유저가 아닌)

그러니까 쉽게 말해 그냥 거의 외부에서 API를 통해 데이터를 가져와 렌더링하는 모든 페이지는 쓰면 된다.
