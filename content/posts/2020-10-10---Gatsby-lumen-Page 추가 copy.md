---
title: Gatsby Lumen 템플릿에 추가 페이지 만들기
date: "2020-10-04"
template: "post"
draft: false
slug: "/posts/gatsby/new-page"
category: "javascript"
tags:
  - "gatsby"
  - "gatsby starter lumen"
  - "추가 페이지"
  - "새 페이지"
description: Gatsby Lumen 블로그에 일상생활 페이지를 만들어보자.
---

<style>
.focus-red{
  color:red;
  font-weight:bold;
}
</style>

gatsby starter lumen으로 만든 블로그에서 새로운 탭을 추가해보고 싶었다.

개발관련된 스토리만 쓰는 것이 아닌 일상생활 관련된 포스팅도 올려보고 싶었기 때문이다.

## config.js에 추가될 페이지 넣어주기

config.js에서 웬만한 것들은 거의 다 편집할 수 있다.
블로그 왼쪽에 뜨는 메뉴 관련 탭 라우팅 설정할 수 있다.

```js
  menu: [
    {
      label: '개발 블로그 포스팅',
      path: '/'
    },
    {
      label: '일상 및 취미',
      path: '/normal'
    },
    {
      label: 'About me',
      path: '/pages/about'
    }
  ],

```

<hr>

## Template 만들어주기

내가 만들고자 하는 일사생활 및 취미 메뉴는 단 page가 아니다.

따라서 내가 첫 블로그에 들어갔을 때 나타나는 것처럼 여러개의 post들이 합쳐진 형태의 template이 필요했다.

`src/templates` 폴더 아래 `daily-template`을 만들어준다.

사실상 `index-template`과 똑같다고 생각하면 된다.

```js


const dailyTemplate = ({ data, pageContext }) => {
...
생략
...
export const query = graphql`
  query dailyTemplate($postsLimit: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $postsLimit
      skip: $postsOffset
      filter: {
        frontmatter: { template: { eq: "daily" }, draft: { ne: true } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
            cardimage
          }
        }
      }
    }
  }
`;

export default dailyTemplate;
```

달라진 점은

- 11번 라인에서 template을 **daily**로 바꾸어준다.
- 26번 라인에서 graphql에 cardimage 추가 -> 대표 이미지를 넣고 싶었다.

즉 contents 폴더 아래 마크다운 형식의 파일을 만들때

```js
---
title: Gatsby Lumen 템플릿에 추가 페이지 만들기
date: "2020-10-04"
template: "post"
---

```

이 때 template을 daily라고 만들게 되면 daily template이 적용될 것이다.

## pagination 아래에 create-daily-pages.js 만들어주기

일상생활 및 취미 관련 페이지는 페이지네이션이 필요하다. 따라서 index와 마찬가지로 페이지네이션을 해준다.

```js
module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { template: { eq: "daily" }, draft: { ne: true } }
        }
      ) {
        totalCount
      }
    }
  `);

  const { dailyPostPerPage } = siteConfig;
  const numPages = Math.ceil(
    result.data.allMarkdownRemark.totalCount / dailyPostPerPage
  );

  for (let i = 0; i < numPages; i += 1) {
    createPage({
      path: i === 0 ? "/normal" : `/normal/${i}`,
      component: path.resolve("./src/templates/daily-template.js"),
      context: {
        currentPage: i,
        postsLimit: dailyPostPerPage,
        postsOffset: i * dailyPostPerPage,
        prevPagePath: i <= 1 ? "/" : `/normal/${i - 1}`,
        nextPagePath: `/normal/${i + 1}`,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1,
      },
    });
  }
};
```

`create-posts-pages`와 판박이로 비슷하며 url만 다르게 만들어주는 역할이라고 생각하면 된다.

## create-pages에 daily 넣어주기

`gatsby/create-pages`에 코드를 추가해놓아야 검색이 되고 페이지가 만들어진다.

```js

const createDailyPages = require('./pagination/create-daily-pages.js');

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

...
생략
...

  _.each(edges, (edge) => {
    if (_.get(edge, 'node.frontmatter.template') === 'page') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/page-template.js'),
        context: { slug: edge.node.fields.slug }
      });
    } else if (_.get(edge, 'node.frontmatter.template') === 'post' || _.get(edge, 'node.frontmatter.template') === 'daily') {
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve('./src/templates/post-template.js'),
        context: { slug: edge.node.fields.slug }
      });
    }
  });

  // Feeds
  await createTagsPages(graphql, actions);
  await createCategoriesPages(graphql, actions);
  await createDailyPages(graphql, actions);
  await createPostsPages(graphql, actions);
};

```

- 17번 라인에서 post뿐만 아니라 daily로 설정된것도 page를 만들어주도록 한 것을 볼 수 있다.
<hr>

<br>

## daily-template에서 대표 이미지 넣어주기

일반 개발 관련 글을 쓸때는 대표이미지가 그닥 필요하지 않고 넣을 이미지도 딱히 없으므로 필요가 없다.

하지만 일상관련 글을 쓸 때에는 사진들을 많이 올리게 될 텐데 사진이 없는 것은 좀 허전하다.

그래서 코드를 약간만 수정해서 daily template에서는 이미지가 나오게끔 만들었다.

post에 들어가는 각각의 컴포넌트들은 Feed 컴포넌트이기 때문에
`src/components/Feed`를 수정해주면 된다.

```jsx
const Feed = ({ edges, daily }: Props) => {
  return (
    <div className={styles["feed"]}>
      {edges.map((edge) => (
        <div className={styles["feed__item"]} key={edge.node.fields.slug}>
          <div className={styles["feed__item-meta"]}>
            <time
              className={styles["feed__item-meta-time"]}
              dateTime={moment(edge.node.frontmatter.date).format(
                "MMMM D, YYYY"
              )}
            >
              {moment(edge.node.frontmatter.date).format("MMMM YYYY")}
            </time>
            <span className={styles["feed__item-meta-divider"]} />

            <span className={styles["feed__item-meta-category"]}>
              <Link
                to={edge.node.fields.categorySlug}
                className={styles["feed__item-meta-category-link"]}
              >
                {edge.node.frontmatter.category}
              </Link>
            </span>
          </div>

          <h2 className={styles["feed__item-title"]}>
            <Link
              className={styles["feed__item-title-link"]}
              to={edge.node.fields.slug}
            >
              {edge.node.frontmatter.title}
            </Link>
          </h2>
          {daily && (
            <div className={styles["feed__item-cardImage"]}>
              <Link to={edge.node.fields.slug}>
                <img src={edge.node.frontmatter.cardimage} />
              </Link>
            </div>
          )}
          <p className={styles["feed__item-description"]}>
            {edge.node.frontmatter.description}
          </p>
          <Link
            className={styles["feed__item-readmore"]}
            to={edge.node.fields.slug}
          >
            Read
          </Link>
        </div>
      ))}
    </div>
  );
};
```

- **35번 라인** Feed에서 daily prop이 있을 때만 이미지를 삽입해준다.

```scss
/* Feed.module.scss*/
.feed {
  &__item {
    @include margin-bottom(1.25);

    &:last-child {
      @include margin-bottom(0.5);
    }
    &-cardImage {
      width: 100%;
      height: fit-content;
      margin-bottom: 1.5rem;
      & > img {
        width: 100%;
        height: auto;
      }
    }
  }
}
```

이렇게 feed scss까지 설정해주고나면 완성이다.
