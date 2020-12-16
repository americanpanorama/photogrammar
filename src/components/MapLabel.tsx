import React, { useState, useEffect, useRef} from 'react';
import './MapLabel.css';
import { MapLabelProps } from '../index.d';

const MapLabel = (props: MapLabelProps) => {
  const { label, x, y } = props;
  const refBackground = useRef();
  const refForeground = useRef();

  const [fontSize, setFontSize] = useState(props.fontSize);

  if (!label || !x || !y) {
    return null;
  }

  // useEffect(() => {
  //   d3.select(refBackground.current)
  //     .transition()
  //     .duration(900)
  //     .attr("font-size", props.fontSize)
  //     .style("stroke-width", props.fontSize / 4);
  //   d3.select(refForeground.current)
  //     .transition()
  //     .duration(900)
  //     .attr("font-size", props.fontSize)
  //     .on('end', () => {
  //       setFontSize(props.fontSize);
  //     });
  // }, [props.fontSize]);

  return (
    <g
      className='mapLabel'
      transform={`translate(${x} ${y})`}
    >
      <text
        fontSize={fontSize}
        textAnchor='middle'
        stroke='white'
        strokeOpacity={0.9}
        className='labelBackground'
        ref={refBackground}
        style={{
          strokeWidth: fontSize / 4,
        }}
      >
        {label}
      </text>
      <text
        fontSize={fontSize}
        textAnchor='middle'
        fill='black'
        strokeWidth={0}
        className='labelForeground'
        ref={refForeground}
      >
        {label}
      </text>
    </g>
  );
};

export default MapLabel;
