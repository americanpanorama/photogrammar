import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import * as d3 from 'd3';
import './State.css';

const State = ({ abbr, name, nhgis_join, d, scale, labelCoords, fillOpacity, linkActive, onHover, onUnhover }) => {
  const ref = useRef(null)

  // useEffect(() => {
  //   d3.select(ref.current)
  //     .transition()
  //     .duration(750)
  //     .style("stroke-width", (nhgis_join === selectedCounty) ?  3 / scale : 0.2 / scale);
  // });

  return (
    <Link
      to={`/state/${abbr}`}
      key={abbr}
      onClick={(!linkActive) ? () => { e.preventDefault() } : () => {}}
      className='statePolygon'
    >
      <path
        d={d}
        className={`stateBoundary ${(!linkActive) ? 'unselectable' : ''}`}
        strokeWidth={0.7 / scale}
        fill='transparent'
        stroke='#999'
        strokeWidth={0.7 / scale}

        // style={{
        //   fillOpacity: fillOpacity,
        //   strokeWidth: 0.7 / scale,
        // }}
        //onMouseLeave={() => { onUnhover() }}
        //onMouseEnter={() => { onHover(abbr) }}
        
      />
      {(labelCoords && labelCoords[0]) && (
        <g
          className='inspected'
        >
          <path
            d={d}
            fill='transparent'
            stroke='#999'
            strokeWidth={4 / scale}
          />
          <text
            x={labelCoords[0]}
            y={labelCoords[1]}
            textAnchor='middle'
            fontSize={15 / scale}
            stroke='black'
            strokeWidth={2 / scale}
          >
            {name}
          </text>
          <text
            x={labelCoords[0]}
            y={labelCoords[1]}
            textAnchor='middle'
            fontSize={15 / scale}
            fill='#eee'
          >
            {name}
          </text>
        </g>
      )}
    </Link>
  );
};

export default State;

State.propTypes = {
  d: PropTypes.string.isRequired,
};

State.defaultProps = {
  
};
