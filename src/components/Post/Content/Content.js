// @flow
import React from "react";
import styles from "./Content.module.scss";
import classnames from "classnames";

type Props = {
  body: string,
  title: string
};

const Content = ({ body, title }: Props) => (
  <div className={styles["content"]}>
    <h1 className={classnames(styles["content__title"])}>{title}</h1>
    <div
      className={styles["content__body"]}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  </div>
);

export default Content;
