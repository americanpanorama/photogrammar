import React from 'react';
import PropTypes from 'prop-types';

const Steamgraph = ({ selectedPhotographer, paths, selectPhotographer, width, height }) => {
  return (
    <svg
      width={width}
      height={height}
    >
      <g transform={`scale(${width}, ${height})`}>
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

