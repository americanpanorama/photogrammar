import React, { useState, useRef, useEffect } from 'react';
import { Link  } from "react-router-dom";
//import * as d3 from 'd3';
import './County.css';
import { StyledCounty } from '../index.d';

interface Props extends StyledCounty {
  scale: number;
  linkActive: boolean;
  link?: string;
  makeLink([]: { type: string, payload: string}[]): string;
  onCountyHover(arg0: string): void;
  onCountyUnhover(): void;
}

const County = (props: Props) => {
  const {
    d,
    name,
    nhgis_join,
    makeLink,
    labelCoords,
    fill,
    fillOpacity,
    scale,
    linkActive,
    onCountyHover,
    onCountyUnhover,
  } = props;
  let { link } = props;
  const ref = useRef(null);

  const currentStrokeWidth = useRef(props.strokeWidth);

  const [strokeWidth, setStrokeWidth] = useState(props.strokeWidth);

  // useEffect(() => {
  //   if (currentStrokeWidth !== props.strokeWidth) {
  //     d3.select(ref.current)
  //       .transition()
  //       .duration(1000)
  //       .style("stroke-width", props.strokeWidth)
  //       .on("end", () => {
  //         currentStrokeWidth.current = props.strokeWidth;
  //       });
  //   }
  // });

  if (!link) {
    link = makeLink([{
      type: 'set_county',
      payload: nhgis_join,
    }]);
  }

  return (
    <Link
      to={link}
      onClick={(!linkActive) ? e => e.preventDefault() : () => {}}
      key={nhgis_join}
    >
      <path
        d={d}
        style={{
          fill: fill,
          fillOpacity: fillOpacity,
          strokeWidth: 0, //strokeWidth, //(nhgis_join === selectedCounty) ?  3 / scale : 0.2 / scale,
          stroke: '#444',
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
