import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const TimelineHeatmap = (props) => {
  const {
    timelineCells,
    photographers,
    selectedPhotographer,
    selectPhotographer,
    clearPhotographer,
    timeRange,
    width,
    height,
    leftAxisWidth,
    baseColor,
  } = props;

  const photographerRefs = {};
  photographers.forEach(p => {
    photographerRefs[p.key] = useRef(null);
  });

  const monthNum = m => (m - 1) / 12;
  const getTimeCode = (year, month) => year * 100 + month;
  const timeCodeToNum = timecode => Math.floor(timecode / 100) + monthNum(timecode % 100);
  const x = d3.scaleLinear()
    .domain([1935, 1944 + monthNum(6)])
    .range([leftAxisWidth, width]);
  const y = d3.scaleLinear()
      .domain([0, photographers.length])
      .range([0, height]);
  const monthWidth = x(1935 + monthNum(2)) - x(1935);
  const opacityDenominator = Math.min(200, Math.max(...timelineCells.map(tc => tc.count)));

  const onHover = (e) => {
    const pId = e.currentTarget.id;
    Object.keys(photographerRefs).forEach(id => {
      const fillOpacity = (id === pId) ? 0 : 0.9;
      d3.select(photographerRefs[id].current)
        .style("fill-opacity", fillOpacity);
    });
  };

  const onOut = () => {
    Object.keys(photographerRefs).forEach(id => {
      const fillOpacity = (!selectedPhotographer || selectedPhotographer === id) ? 0 : 0.7;
      d3.select(photographerRefs[id].current)
        .style("fill-opacity", fillOpacity);
    });
  }

  return (
    <svg
      width={width}
      height={height}
    >
      {timelineCells.map(tc => (
        <React.Fragment
          key={`${tc.year}-${tc.month}-${tc.photographer}`}
        >
          <rect
            x={x(tc.year + monthNum(tc.month))}
            y={y(photographers.findIndex(p => p.key === tc.photographer)) + 2}
            width={monthWidth}
            height={height / photographers.length - 4}
            fillOpacity={(tc.count > 0) ? 0.05 + 0.95 * tc.count / opacityDenominator : 0}
            fill={(!(getTimeCode(tc.year, tc.month) < timeRange[0] || getTimeCode(tc.year, tc.month) > timeRange[1]) && (!selectedPhotographer || selectedPhotographer === tc.photographer)) ? baseColor : '#aaaaaa'}
            stroke='#aaa'
            strokeWidth={0}
          />
          {(getTimeCode(tc.year, tc.month) < timeRange[0] || getTimeCode(tc.year, tc.month) > timeRange[1]) && (
            <rect
              x={x(tc.year + monthNum(tc.month))}
              y={y(photographers.findIndex(p => p.key === tc.photographer)) + 2}
              width={monthWidth}
              height={height / photographers.length - 4}
              fillOpacity={0.9}
              fill='white'
            />
          )}
        </React.Fragment>
      ))}

      {[1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945].map(y => (
        <line
          x1={x(y) - 0.25}
          x2={x(y) - 0.25}
          y1={0}
          y2={height}
          strokeWidth={(getTimeCode(y, 0) >= timeRange[0] && getTimeCode(y, 0) <= timeRange[1]) ? 0.5 : 0}
          stroke={(y >= 1942) ? 'black': '#ddd'}
          key={`lineFor${y}`}
        />
      ))}

      {photographers.map((p, i) => {
        return (
          <g key={p.key}>
            <line
              x1={Math.max(x(Math.floor(p.firstDate / 100)), x(timeCodeToNum(timeRange[0])))}
              x2={Math.max(x(Math.floor(p.firstDate / 100)), x(timeCodeToNum(timeRange[0])))}
              y1={0}
              y2={y(i + 1)}
              strokeWidth={0.5}
              stroke={(Math.floor(p.firstDate / 100) * 100 >= timeRange[0] && Math.floor(p.firstDate / 100) * 100 <= timeRange[1]) ? 'black': '#ddd'}
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
              x={x(p.firstDate / 100 - 3)}
              y={y(i)}
              width={width + leftAxisWidth}
              height={height / photographers.length}
              fill='white'
              fillOpacity={(!selectedPhotographer || selectedPhotographer === p.key) ? 0 : 0.7}
              onClick={(p.active) ? selectPhotographer : () => false}
              onMouseEnter={onHover}
              onMouseLeave={onOut}
              id={p.key}
              ref={photographerRefs[p.key]}
            />
          </g>
        );
      })}

      {(selectedPhotographer) && (
        <text
          x={x(1937.5)}
          y={y(15)}
          textAnchor='end'
          onClick={clearPhotographer}
          fontSize={height / photographers.length * 1.5}
          fill="#6a1b9a"
        >
          clear selected photographer
        </text>
      )}
    </svg>
  );
};

export default TimelineHeatmap;

TimelineHeatmap.propTypes = {
  timelineCells: PropTypes.array.isRequired,
};

TimelineHeatmap.defaultProps = {
  
};
