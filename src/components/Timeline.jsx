import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimelineRow from './TimelineRow.jsx';
import './Timeline.css';
import { buildLink } from '../helpers.js';

const TimelineHeatmap = (props) => {
  const {
    photographers,
    selectedPhotographer,
    width,
    translateY,
    leftAxisWidth,
    monthHeight,
    monthWidth,
  } = props;

  const [showOthers, setShowOthers] = useState(false);
  const [hoveredPhotographer, setHoveredPhotographer] = useState(null);

  const clearLink = buildLink({ remove: ['photographers']});

  // this will close the other photographers if one is selected
  const otherPhotographerSelected = useRef(selectedPhotographer);
  if (selectedPhotographer && selectedPhotographer !== otherPhotographerSelected.current) {
    // only close if it's an other photographer
    const { isOther } = photographers.find(p => p.key === selectedPhotographer);
    if (isOther) {
      otherPhotographerSelected.current = selectedPhotographer;
      setShowOthers(false);
    }
  }

  const height = props.height - translateY;

  const onHover = (photographerKey) => {
    if (hoveredPhotographer !== photographerKey) {
      setHoveredPhotographer(photographerKey);
    }
  };

  const onUnhover = () => {
    if (hoveredPhotographer) {
      setHoveredPhotographer(null);
    }
  };
  
  return (
    <div
      className='timeline'
      style={{
        overflowY: (showOthers) ? 'visible' : 'hidden',
        height: props.height,
        zIndex: 1001,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
        }}
      >
        <svg
          width={width + leftAxisWidth}
          height={height}
        >
          <filter id="grayscale">
            <feColorMatrix type="saturate" values="0.1"/>
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.3"/>
            </feComponentTransfer>
          </filter>
          {photographers
            .sort((a, b) =>  {
              if (!hoveredPhotographer && !selectedPhotographer) {
                return 0;
              }
              if (hoveredPhotographer === a.key) {
                return -1;
              }
              if (selectedPhotographer === a.key) {
                return -1;
              }
              if (hoveredPhotographer === b.key) {
                return 1;
              }
              if (selectedPhotographer === b.key) {
                return 1;
              }
              return 0;
            })
            .map(p => {
              let y = p.y;
              // the other photographers cells are overlayed on one another when they're not individually shown
              if (p.isOther && !showOthers) {
                y = translateY * -1 + 1 + monthHeight / 2;
              }
              // with one exception: if the photographer is selected
              if (!showOthers && p.isOther && selectedPhotographer === p.key) {
                y = translateY * -1 + 1 + monthHeight * 2;
              }
              return (
                <TimelineRow
                  {...p}
                  y={y}
                  showLabel={(!p.isOther || selectedPhotographer === p.key || showOthers)}
                  deemphasize={(hoveredPhotographer && hoveredPhotographer !== p.key)}
                  emphasize={(selectedPhotographer && selectedPhotographer === p.key) || (hoveredPhotographer && hoveredPhotographer === p.key)}
                  photographerKey={p.key}
                  monthWidth={monthWidth}
                  monthHeight={monthHeight}
                  key={`timelineRowFor${p.key}`}
                  onHover={onHover}
                  onUnhover={onUnhover}
                />
              );
          })}

          <g
            transform={`translate(${leftAxisWidth - 10} ${height - monthHeight * 13})`}
          >
            {(selectedPhotographer) ? (
              <Link
                to={clearLink}
              >
                <g transform={'translate(-15 0)'}>
                  <line
                    x1={-8}
                    x2={8}
                    y1={-8}
                    y2={8}
                    strokeWidth={18 / 9}
                    stroke='black'
                  />
                  <line
                    x1={-8}
                    x2={8}
                    y1={8}
                    y2={-8}
                    strokeWidth={18 / 9}
                    stroke='black'
                  />
                </g>
                <text
                  x={-30}
                  y={0}
                  textAnchor='end'
                  fontSize={height / photographers.length * 1.5}
                >
                  <tspan>
                    clear selected
                  </tspan>
                  <tspan
                    x={-30}
                    dy={height / photographers.length * 1.75}
                  >
                    photographer
                  </tspan>
                </text>
              </Link>
            ) : (
              <React.Fragment>
                <g transform={'translate(-15 0) rotate(315)'}>
                  <circle
                    cx={0}
                    cy={18 * 1.5  * -0.1}
                    r={18  * 1.5  * 0.2}
                    fill='transparent'
                    fillOpacity={1}
                    strokeWidth={18 / 9}
                    stroke='black'
                  />
                  <line
                    x1={0}
                    x2={0}
                    y1={18  * 1.5  * 0.1}
                    y2={18  * 1.5  * 0.4}
                    strokeWidth={18 / 7}
                    stroke='black'
                  />
                </g>
                <text
                  x={-30}
                  y={0}
                  textAnchor='end'
                  fontSize={height / photographers.length * 1.5}
                  className='tip'
                >
                  <tspan>
                    To select a photographer
                  </tspan>
                  <tspan
                    x={-30}
                    dy={height / photographers.length * 1.75}
                  >
                    click on their name
                  </tspan>
                </text>
              </React.Fragment>
            )}
          </g>

          {/* the legend */}
          <g
            transform={`translate(${leftAxisWidth * 3/4 - 20} ${height - monthHeight * 7})`}
            className='legend'
          >
            <text
              textAnchor='middle'
              fontSize={monthHeight * 1.5}
            >
              <tspan>
                Each box shows the number
              </tspan>
              <tspan
                x={0}
                dy={monthHeight * 1.75}
              >
                of photos taken that month
              </tspan>
            </text>

            <defs>
              <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"
                  style={{
                    stopOpacity: 0,
                  }}
                />
                <stop offset="100%" 
                  style={{
                    stopOpacity: 1,
                  }} />
              </linearGradient>
            </defs>

            <rect 
              x={leftAxisWidth * -1 / 4}
              y={monthHeight * 2.2}
              width={leftAxisWidth * 2 / 4}
              height={monthHeight * 1.5}
              fill="url(#legendGrad)"
            />

            <g
              className='axis'
              transform={`translate(0 ${monthHeight * 5.2})`}
            >
              <text
                fontSize={monthHeight * 1.25}
                x={leftAxisWidth * -1 / 4}
              >
                0
              </text>
              <text
                fontSize={monthHeight * 1.25}
              >
                100
              </text>
              <text
                x={leftAxisWidth * 1 / 4}
                fontSize={monthHeight * 1.25}
              >
                200+
              </text>
            </g>
          </g>

          {(!showOthers) ? (
            <text
              x={leftAxisWidth - 2}
              y={monthHeight * 1.5 - translateY}
              textAnchor='end'
              onClick={() => setShowOthers(true)}
              fontSize={monthHeight * 1.2}
            >
              other photographers
            </text>
          ) : (
            <text
              x={width * 0.5}
              y={height * 0.1}
              textAnchor='end'
              onClick={() => setShowOthers(false)}
              fontSize={height / photographers.length * 1.5}
            >
              collapse photographers with less than 500 photos
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default TimelineHeatmap;

TimelineHeatmap.propTypes = {

};

TimelineHeatmap.defaultProps = {
  
};
