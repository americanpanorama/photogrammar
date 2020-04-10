import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const TimelineRow = (props) => {
  const {
    firstname,
    lastname,
    photographerKey,
    active,
    labelX,
    months,
    y,
    monthWidth,
    monthHeight,
    yearTicks,
    showLabel,
    onClick,
    onHover,
    onUnhover,
    deemphasize,
  } = props;

  const [translateY, setTranslateY] = useState(y);
  const isAnimating = useRef(false);
  isAnimating.current = (translateY !== y);

  const ref = useRef();

  useEffect(
    () => {
      d3.select(ref.current)
        .transition()
        .duration(1000)
        .attr('transform', `translate(0, ${y})`)
        .on('end', () => {
          setTranslateY(y);
        });
    }, [y]
  );

  return (
    <g
      transform={`translate(0, ${translateY})`}
      ref={ref}
    >
      {(showLabel) && (
        <text
          x={labelX}
          y={monthHeight * 0.9}
          fontSize={monthHeight * 1.1}
          textAnchor='end'
          fill={(active) ? "#555" : "#ddd"}
          filter={(deemphasize) ? 'url(#grayscale)' : null}
        >
          {`${firstname} ${lastname}`}
        </text>
      )}

      {months.map(c => (
        <rect
          x={c.x}
          y={0}
          width={monthWidth}
          height={monthHeight}
          fillOpacity={c.fillOpacity}
          fill={c.fill}
          strokeWidth={0}
          key={`cellFor${c.year}${c.month}`}
          filter={(c.inSelection && !deemphasize) ? null : 'url(#grayscale)'}
        />
      ))}

      {yearTicks.map(yt => (
        <line
          x1={yt.x}
          x2={yt.x}
          y1={0}
          y2={monthHeight + 2}
          stroke={yt.stroke}
          key={`lineFor${yt.x}`}
        />
      ))}

      {/* a transparent hoverable and selectable rect that covers the whole element */}
      <rect
        x={labelX - monthWidth * 12}
        y={0}
        width={monthWidth * 150}
        height={monthHeight}
        fill={'transparent'}
        id={photographerKey}
        onClick={onClick}
        onMouseEnter={() => { if (!isAnimating.current) { onHover(photographerKey) }}}
        onMouseLeave={() => { if (!isAnimating.current) { onUnhover() }}}
      />
    </g>
  );
};

export default TimelineRow;

TimelineRow.propTypes = {
  firstname: PropTypes.string,
};

TimelineRow.defaultProps = {
  
};
