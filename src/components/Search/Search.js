import React, { useState } from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { MDBCol, MDBFormInline, MDBIcon } from 'mdbreact';
import styles from './Search.module.scss';

const Search = (props) => {
  const { data } = props;
  const allPosts = data.allMarkdownRemark.edges;
  const emptyQuery = '';

  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  });

  const handleInputChange = (event) => {
    const query = event.target.value;
    const { data } = props;
    // this is how we get all of our posts
    const posts = data.allMarkdownRemark.edges || [];
    // return all filtered posts

    const filteredData = posts.filter((post) => {
      // destructure data from post frontmatter
      const { description, title, tags } = post.node.frontmatter;
      return (
        // standardize data with .toLowerCase()
        // return true if the description, title or tags
        // contains the query string
        description && description.toLowerCase().includes(query.toLowerCase())
        || title && title.toLowerCase().includes(query.toLowerCase())
        || tags && tags
          .join('') // convert tags from an array to string
          .toLowerCase()
          .includes(query)
      );
    });
    console.log('filter', filteredData);

    setState({
      query, // with current query string from the `Input` event
      filteredData, // with filtered data from posts.filter(post => (//filteredData)) above
    });
  };


  const renderSearchResults = () => {
    const { query, filteredData } = state;
    const hasSearchResults = filteredData && query !== emptyQuery;
    const posts = hasSearchResults ? filteredData : [];
    return (
      posts
      && posts.map(({ node }) => {
        const { excerpt } = node;

        const { slug } = node.fields;
        const {
          tags, title, date, description
        } = node.frontmatter;
        return (
          <div key={slug} className={styles['search-article']}>
            <article key={slug} >
              <header>
                <h2 className={styles['search-title']}>
                  <Link to={slug}>{title}</Link>
                </h2>
              </header>
              <section>
                <p className={styles['search-description']}
                  dangerouslySetInnerHTML={{
                    __html: description || excerpt,
                  }}
                />
                <p className={styles['search-date']}><em>{date}</em></p>
              </section>
            </article>
          </div>
        );
      })
    );
  };


  return (
    <div className={styles['search']}>
      <MDBCol md="12">
        <MDBFormInline className="md-form">
          <MDBIcon icon="search" />
          <input
            className="form-control form-control-sm ml-3 w-75"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={handleInputChange}
          />
        </MDBFormInline>
      </MDBCol>
      {state.query && <div className={styles['search-result-container']}>
        {renderSearchResults()}
      </div>}
    </div >
  );
};


export default (props) => (
  <StaticQuery
    query={
      graphql`
        query {
            allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
              edges {
                node {
                  excerpt(pruneLength: 200)
                  id
                  frontmatter {
                    title
                    description
                    date(formatString: "MMMM DD, YYYY")
                    tags
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
    }

    render={(data) => <Search data={data} {...props} />}
  />
);
/**
       *
       * Search.js에서 해야 할 것
       * 1. props를 index-template에서 가지고 와야 함.
       * 2. 그리고 각각의
 */