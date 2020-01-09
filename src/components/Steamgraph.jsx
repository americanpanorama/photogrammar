import React from 'react';
import PropTypes from 'prop-types';

const Steamgraph = ({ selectedPhotographer, paths, selectPhotographer }) => {
  return (
    <svg
      width={900}
      height={300}
    >
      <g transform={`scale(900, 300)`}>
        {paths.map((sp, i) => (
          <path
            d={sp.d}
            fill={sp.fill}
            fillOpacity={(!selectedPhotographer || selectedPhotographer === sp.photographerKey) ? 1 : 0.1}
            key={sp.photographerKey}
            id={sp.photographerKey}
            onClick={selectPhotographer}
          />
        ))}
      </g>
    </svg>
  );
};

export default Steamgraph;

Steamgraph.propTypes = {
  selectedPhotographer: PropTypes.string,
  paths: PropTypes.array,
  selectPhotographer: PropTypes.func.isRequired,
};

Steamgraph.defaultProps = {
  selectedPhotographer: null,
};

