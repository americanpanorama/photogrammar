import React from 'react';
import PropTypes from 'prop-types';

const Close = ({ onClick, className, role }) => {
  return (
    <button
      onClick={(onClick) ? onClick : () => false}
      className={`close ${className}`}
      role={role || false}
    >
      <svg
        width={25}
        height={25}
      >
        <g transform='translate(12.5 12.5)'>
          <line
            x1={-5}
            x2={5}
            y1={-5}
            y2={5}
          />
          <line
            x1={-5}
            x2={5}
            y1={5}
            y2={-5}
          />
        </g>
      </svg>
    </button>
  );
};

export default Close;

Close.propTypes = {
  onClick: PropTypes.func,
};

Close.defaultProps = {
  
};
