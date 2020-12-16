import React, { useRef } from 'react';
import { Link } from "react-router-dom";
//import * as d3 from 'd3';
import './State.css';
import { StyledState } from '../index.d';

interface Props extends StyledState {
  link: string;
  linkActive: boolean;
  scale: number;
  // onHover(arg0: string): void;
  // onUnhover(): void;
}

const State = (props: Props) => {
  const {
    abbr,
    name,
    link,
    nhgis_join,
    d,
    scale,
    labelCoords,
    fillOpacity,
    linkActive,
    // onHover,
    // onUnhover,
  } = props;
  const ref = useRef(null)

  // useEffect(() => {
  //   d3.select(ref.current)
  //     .transition()
  //     .duration(750)
  //     .style("stroke-width", (nhgis_join === selectedCounty) ?  3 / scale : 0.2 / scale);
  // });

  return (
    <Link
      to={link}
      key={abbr}
      onClick={(!linkActive) ? (e: any) => { e.preventDefault()   } : () => {}}
      className='statePolygon'
    >
      <path
        d={d}
        className={`stateBoundary ${(!linkActive) ? 'unselectable' : ''}`}
        fill='transparent'
        stroke='#999'
        strokeWidth={0.7 / scale}       
      />
      {(labelCoords && labelCoords[0]) && (
        <g
          className='inspected'
        >
          <path
            d={d}
            fill='transparent'
            stroke='#999'
            strokeWidth={3 / scale}
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
