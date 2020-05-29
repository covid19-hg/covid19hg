import React from "react";
import PropTypes from "prop-types";

export const HTMLContent = ({
  content,
  className,
}: {
  content: string;
  className: string;
}) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content = ({
  content,
  className,
}: {
  content: string;
  className: string;
}) => <div className={className}>{content}</div>;

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
};

HTMLContent.propTypes = Content.propTypes;

export default Content;
