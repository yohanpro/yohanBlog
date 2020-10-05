'use strict';

const path = require('path');
const siteConfig = require('../../config.js');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "daily" }, draft: { ne: true } } }
      ) { totalCount }
    }
  `);

  const { dailyPostPerPage } = siteConfig;
  const numPages = Math.ceil(result.data.allMarkdownRemark.totalCount / dailyPostPerPage);

  for (let i = 0; i < numPages; i += 1) {
    createPage({
      path: i === 0 ? '/normal' : `/normal/${i}`,
      component: path.resolve('./src/templates/daily-template.js'),
      context: {
        currentPage: i,
        postsLimit: dailyPostPerPage,
        postsOffset: i * dailyPostPerPage,
        prevPagePath: i <= 1 ? '/' : `/normal/${i - 1}`,
        nextPagePath: `/normal/${i + 1}`,
        hasPrevPage: i !== 0,
        hasNextPage: i !== numPages - 1
      }
    });
  }
};
