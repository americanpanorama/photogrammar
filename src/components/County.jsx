import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import * as d3 from 'd3';
import './County.css';

const County = (props) => {
  const {
    d,
    name,
    photoCount,
    nhgis_join,
    labelCoords,
    fill,
    fillOpacity,
    strokeOpacity,
    scale,
    selectedCounty,
    linkActive,
    onCountyHover,
    onCountyUnhover,
  } = props;
  const ref = useRef(null)

  const [ strokeWidth, setStrokeWidth] = useState(props.strokeWidth);

  useEffect(() => {
    d3.select(ref.current)
      .transition()
      .duration(1000)
      .style("stroke-width", props.strokeWidth)
      .on("end", () => {
        setStrokeWidth(props.strokeWidth);
      });
  });

  return (
    <Link
      to={`/county/${nhgis_join}`}
      onClick={(!linkActive) ? e => e.preventDefault() : () => {}}
      key={nhgis_join}
    >
      <path
        d={d}
        style={{
          fill: fill,
          fillOpacity: fillOpacity,
          strokeWidth: strokeWidth, //(nhgis_join === selectedCounty) ?  3 / scale : 0.2 / scale,
          stroke: 'white',
          strokeOpacity: 1,
        }}
        ref={ref} 
        id={nhgis_join}
        className={'countyBoundary'}
        onMouseEnter={() => { onCountyHover(nhgis_join)}}
        onMouseLeave={() => { onCountyUnhover() }}
      />
      {( false && labelCoords && labelCoords[0]) && (
        <g
          className='countyInspected'
        >
          <path
            d={d}
            fill='transparent'
            stroke='black'
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

export default County;

County.propTypes = {
  d: PropTypes.string.isRequired,
};

County.defaultProps = {
  
};