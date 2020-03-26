import React from "react";
import PropTypes from "prop-types";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import Link from "gatsby-link";

const FeatureGrid = ({ gridItems }) => (
  <div className="columns is-multiline">
    {gridItems.map(item => {
      let content = (
        <section className="section">
          <div className="has-text-centered">
            <div
              style={{
                width: "300px",
                display: "inline-block"
              }}
            >
              <PreviewCompatibleImage imageInfo={item} />
            </div>
          </div>
          <p>{item.text}</p>
        </section>
      );
      if (item.link) {
        if (item.link[0] === "/") {
          // Use gatsby link for internal links:
          return (
            <Link key={item.link} to={item.link} className="column is-6">
              {content}
            </Link>
          );
        } else {
          // Use normal anchor tag for external link:
          return (
            <a key={item.link} href={item.link} className="column is-6">
              {content}
            </a>
          );
        }
      } else {
        return (
          <div key={item.text} className="column is-6">
            {content}
          </div>
        );
      }
    })}
  </div>
);

FeatureGrid.propTypes = {
  gridItems: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      text: PropTypes.string
    })
  )
};

export default FeatureGrid;
