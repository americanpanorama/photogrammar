import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const Expand = ({ link, className, role }) => {
  return (
    <button
      role={role}
      className={className}
    >
      <Link to={link}>
        <svg
          width={25}
          height={25}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="2"
              markerHeight="2"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g transform='translate(12.5 12.5)'>
            <line
              x2={-6.5}
              x1={-2}
              y2={-6.5}
              y1={-2}
              markerEnd="url(#arrow)"
            />
            <line
              x2={6.5}
              x1={2}
              y2={6.5}
              y1={2}
              markerEnd="url(#arrow)"
            />
            <line
              x2={6.5}
              x1={2}
              y2={-6.5}
              y1={-2}
              markerEnd="url(#arrow)"
            />
            <line
              x2={-6.5}
              x1={-2}
              y2={6.5}
              y1={2}
              markerEnd="url(#arrow)"
            />
          </g>
        </svg>
      </Link>
    </button>
  );
};

export default Expand;

Expand.propTypes = {

};

Expand.defaultProps = {
  
};
