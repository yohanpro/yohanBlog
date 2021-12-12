// @flow
import React from 'react';
import { Link, graphql } from 'gatsby';
import styles from './Menu.module.scss';


type Props = {
  menu: {
    label: string,
    path: string,
  }[],
};

const Menu = (props) => {
  const { menu } = props;
  return (
    <nav className={styles['menu']}>
      <ul className={styles['menu__list']}>
        {menu.map((item) => (
          <li className={styles['menu__list-item']} key={item.path}>
            {item.path.includes('https') ? (
              <a href={item.path} style={{ color: 'initial' }}> {item.label}</a>
            ) : (
              <Link
                to={item.path}
                className={styles['menu__list-item-link']}
                activeClassName={styles['menu__list-item-link--active']}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;

export const query = graphql`
  query MyQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          headings(depth: h1) {
            value
            depth
          }
          frontmatter {
            category
            title
            tags
            slug
          }
        }
      }
    }
  }
`;
