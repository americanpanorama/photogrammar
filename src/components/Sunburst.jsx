import React from 'react';
import PropTypes from 'prop-types';
import Arcs from '../../data/svgs/sunburst.json';

const Treemap = (props) => {
  return (
    <svg
      width={800 }
      height={800}
    >
      <g transform='translate(400 400)'>
        {Arcs.map(arc => (
          <path
            d={arc.d}
            fill={arc.fill}
            fillOpacity={1}
            strokeWidth={0.1}
            stroke='black'
          />
        ))}

        {Arcs.filter(arc => arc.showName).map(arc => (
          <text
            transform={`rotate(${arc.x - 90}) translate(${arc.y},0) rotate(${arc.x < 180 ? 0 : 180})`}
            dy="0.35em"
            textAnchor={arc.textAnchor}
            fontSize={10}
            fontFamily='sans-serif'
          >
            {arc.name}
          </text> 
        ))}
      </g>

    </svg>

  );
};

export default Treemap;

Treemap.propTypes = {
};
 Treemap.defaultProps = {
  
};
