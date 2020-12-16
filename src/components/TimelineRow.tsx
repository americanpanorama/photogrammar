import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import './TimelineRow.css';
import { TimelineRow } from '../index.d';

const Row = (props: TimelineRow) => {
  const {
    label,
    photographerKey,
    active,
    labelX,
    months,
    y,
    ySelectable,
    monthWidth,
    monthHeight,
    labelSize,
    yearTicks,
    showLabel,
    onHover,
    onUnhover,
    emphasize,
    fill,
    linkTo,
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
    <g>
      <g
        transform={`translate(0, ${translateY})`}
        ref={ref}
        className='timelineRow'
      >
        {yearTicks.map(yt => (
          <line
            x1={yt.x}
            x2={yt.x}
            y1={0}
            y2={monthHeight + 2}
            style={{
              stroke: yt.stroke
            }}
            key={`lineFor${yt.x}`}
          />
        ))}

        {(showLabel) && (
          <text
            x={labelX}
            y={(emphasize) ? monthHeight * 1.2 : monthHeight * 0.9}
            fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
            textAnchor='end'
            className={(active) ? "active" : ""}
            strokeWidth={3}
            stroke='white'
            strokeOpacity={0.75}
          >
            {label}
          </text>
        )}

        {(showLabel) && (
          <text
            x={labelX}
            y={(emphasize) ? monthHeight * 1.2 : monthHeight * 0.9}
            fontSize={(emphasize) ? labelSize * 1.5 : labelSize}
            textAnchor='end'
            style={{

              fill: fill,
            }}
            //className={(active) ? 'active' : ''}
          >
            {label}
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
            //className={`cell`} 
            key={`cellFor${c.year}${c.month}`}
          />
        ))}
      </g>

      {/* a transparent hoverable and selectable rect that covers the whole element */}
      {(active) && (
        <Link
          to={linkTo}
        >
          <rect
            x={labelX - monthWidth * 12}
            y={ySelectable - 1.5}
            width={monthWidth * 150}
            height={monthHeight + 3}
            fill={'transparent'}
            id={photographerKey}
            onMouseEnter={() => { if (!isAnimating.current) { onHover(photographerKey) }}}
            onMouseLeave={() => { if (!isAnimating.current) { onUnhover() }}}
          />
        </Link>
      )}
    </g>
  );
};

export default Row;
