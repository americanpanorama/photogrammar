import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const TreemapTheme = (props) => {
  const {
    width,
    height,
    transformX: translateX,
    transformY: translateY,
    name,
    fill,
    fillOpacity,
    strokeWidth,
    fontColor,
    id,
    link,
    imgSrc
  } = props;

  const estimateWidth = (str, fontSize) => str.length * fontSize * 0.5;

  const fontSize = Math.max(10, Math.min(20, 20 * width / 200));
  let tspans = [name];
  if (estimateWidth(name, fontSize) > width * 0.8) {
    // how many words
    const words = name.split(' ');
    if (words.length > 1) {
      // 
      tspans = [words[0]];
      words.slice(1).forEach(word => {
        const lengthIfAdded = estimateWidth(`${tspans[tspans.length -1 ]} ${word}`, fontSize);
        if (lengthIfAdded < width * 0.8) {
          tspans[tspans.length -1] = `${tspans[tspans.length -1]} ${word}`;
        } else {
          tspans.push(word);
        }
      });
    }
  }

  // reverse it as the y offset is negative
  tspans.reverse();

  return (
    <Link
      to={`/themes/${link}`}
    >
      <g 
        transform={`translate(${translateX} ${translateY})`}
      >
        {(imgSrc) && (
          <image
            xlinkHref={`http://photogrammar.yale.edu/photos/service/pnp/${imgSrc}`}
            x={0}
            y={0}
            width={width - strokeWidth}
            height={height - strokeWidth}
            preserveAspectRatio='xMidYMid slice'
            className='rectangular'
          />
        )}
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={width - strokeWidth}
          height={height - strokeWidth}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke={fill}
          strokeWidth={strokeWidth}
          className='rectangular'
        />
        <g transform={`translate(${width / 2} ${height * 0.8 + fontSize * 1.1})`}>
          <text
            x={0}
            y={0}
            fontSize={fontSize}
            textAnchor='middle'
            fill='white'
            stroke={'black'}
            strokeWidth={4}
            strokeOpacity={0.6}
          >
            {(tspans.map((labelPart, i) => (
              <tspan
                x="0"
                textAnchor="middle"
                dy={fontSize * -1.1}
                key={labelPart}
              >
                {labelPart}
              </tspan>
            )))}
          </text>
          <text
            x={0}
            y={0}
            fontSize={fontSize}
            textAnchor='middle'
            fill={fontColor}
            
          >
            {(tspans.map((labelPart, i) => (
              <tspan
                x="0"
                textAnchor="middle"
                dy={fontSize * -1.1}
                key={labelPart}
              >
                {labelPart}
              </tspan>
            )))}
          </text>
        </g>
      </g>
    </Link>
  );
};

export default TreemapTheme;

TreemapTheme.propTypes = {
  transformX: PropTypes.number,
};

TreemapTheme.defaultProps = {
  
};
