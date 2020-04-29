import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SidebarHeaderFacetButton.css';

const ConditionalWrapper = ({ condition, wrapper, children }) => (
  condition ? wrapper(children) : children
);

const SidebarHeaderFacetButton = ({ label, onClick, link }) => {
  if (!label) {
    return null;
  }
  return (
    <ConditionalWrapper
      condition={link}
      wrapper={children => <Link to={link}>{children}</Link>}
    >
      <button
        onClick={onClick}
      >
        {label}
        <svg
          width={30}
          height={30}
        >
          <g transform={'translate(15 15) rotate(45)'}>
            <line
              x1={0}
              x2={0}
              y1={-9}
              y2={9}
              strokeWidth={2}
              stroke='black'
            />
            <line
              x1={-9}
              x2={9}
              y1={0}
              y2={0}
              strokeWidth={2}
              stroke='black'
            />
          </g>
        </svg>
      </button>
    </ConditionalWrapper>
  );
};

export default SidebarHeaderFacetButton;

SidebarHeaderFacetButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.string,
};

SidebarHeaderFacetButton.defaultProps = {
  label: null,
  onClick: () => false,
  link: null,
};
