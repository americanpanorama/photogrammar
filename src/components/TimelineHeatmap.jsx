import React from 'react';
import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import photoCountsWY from '../../data-processing/steamgraph/photoCountsStates.json';

const TimelineHeatmap = ({timelineCells, photographers, selectedState, selectedCounty, selectPhotographer, width, height, leftAxisWidth}) => {
  const monthNum = m => (m - 1) / 12;
  const numToMonth = num => Math.round(num * 12) + 1;
  const x = d3.scaleLinear()
    .domain([1935, 1944 + monthNum(6)])
    .range([leftAxisWidth, width]);
  const y = d3.scaleLinear()
      .domain([0, photographers.length])
      .range([0, height]);

  const monthWidth = x(1935 + monthNum(2)) - x(1935);

  const photoCounts = photoCountsWY["CA"];

  const opacityDenominator = Math.min(200, Math.max(...timelineCells.map(tc => tc.count)));

  return (
    <svg
      width={width}
      height={height}
    >
      {timelineCells.map(tc => (
        <rect
          x={x(tc.year + monthNum(tc.month))}
          y={y(photographers.findIndex(p => p.key === tc.photographer)) + 2}
          width={monthWidth}
          height={height / photographers.length - 4}
          fillOpacity={(tc.count > 0) ? 0.05 + 0.95 * tc.count / opacityDenominator : 0}
          fill='#6a1b9a'
          stroke='#aaa'
          strokeWidth={0}
          id={tc.photographer}
          key={`${tc.year}-${tc.month}-${tc.photographer}`}
        />
      ))}

      {[1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945].map(y => (
        <line
          x1={x(y) - 0.25}
          x2={x(y) - 0.25}
          y1={0}
          y2={height}
          strokeWidth={0.5}
          stroke={(y >= 1942) ? 'black': '#ddd'}
          key={`lineFor${y}`}
        />
      ))}

      {photographers.map((p, i) => {
        return (
          <g key={p.key}>
            <line
              x1={x(Math.floor(p.firstDate / 100))}
              x2={x(Math.floor(p.firstDate / 100))}
              y1={0}
              y2={y(i + 1)}
              strokeWidth={0.5}
              stroke='black'
            />
            <text
              x={x(Math.floor(p.firstDate / 100)) - 5}
              y={y(i) + height / photographers.length - 2}
              fontSize={height / photographers.length * 0.9}
              textAnchor='end'
              fill={(p.active) ? "#555" : "#ddd"}
            >
              {`${p.firstname} ${p.lastname}`}
            </text>
            <rect
              x={0}
              y={y(i)}
              width={width}
              height={height / photographers.length}
              fill='transparent'
              onClick={(p.active) ? selectPhotographer : () => false}
              id={p.key}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default TimelineHeatmap;

TimelineHeatmap.propTypes = {
};

TimelineHeatmap.defaultProps = {
  
};
