import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimelineRow from './TimelineRow.jsx';

const TimelineHeatmap = (props) => {
  const {
    timelineCells,
    photographers,
    selectedState,
    selectedCounty,
    selectedPhotographer,
    timeRange,
    width,
    translateY,
    leftAxisWidth,
    monthHeight,
    monthWidth,
    textColor,
    selectPhotographer,
    clearPhotographer,
  } = props;

  const [showOthers, setShowOthers] = useState(false);
  const [hoveredPhotographer, setHoveredPhotographer] = useState(null);

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
  }

  return (
    <div
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
          {photographers.map(p => {
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
                deemphasize={(hoveredPhotographer && hoveredPhotographer != p.key)}
                photographerKey={p.key}
                monthWidth={monthWidth}
                monthHeight={monthHeight}
                key={`timelineRowFor${p.key}`}
                onHover={onHover}
                onUnhover={onUnhover}
                onClick={selectPhotographer}
              />
            );
          })}

          {(selectedPhotographer) && (
            <text
              x={width * 0.5}
              y={height * 0.9}
              textAnchor='end'
              onClick={clearPhotographer}
              fontSize={height / photographers.length * 1.5}
              fill={textColor}
            >
              clear selected photographer
            </text>
          )}

          {(!showOthers) ? (
            <text
              x={leftAxisWidth - 2}
              y={monthHeight * 1.5 - translateY}
              textAnchor='end'
              onClick={() => setShowOthers(true)}
              fontSize={monthHeight * 1.2}
              fill={textColor}
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
              fill={textColor}
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
