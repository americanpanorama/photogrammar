import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { buildLink } from '../helpers.js';
import './TimelineRow.css';

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
    onHover,
    onUnhover,
    deemphasize,
    emphasize,
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

  const to = buildLink({
    replaceOrAdd: [{
      param: 'photographers',
      value: photographerKey,
    }],
  });

 // `${useLocation().pathname.replace(/\/photographers\/[^/]+/, '')}/photographer/${photographerKey}`;

  return (
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
          stroke={yt.stroke}
          key={`lineFor${yt.x}`}
        />
      ))}

      {(showLabel && emphasize) && (
        <text
          x={labelX}
          y={monthHeight * 1.2}
          fontSize={monthHeight * 2}
          textAnchor='end'
          className={(active) ? "active" : ""}
          strokeWidth={3}
          stroke='white'
          strokeOpacity={0.5}
        >
          {`${firstname} ${lastname}`}
        </text>
      )}

      {(showLabel) && (
        <text
          x={labelX}
          y={(emphasize) ? monthHeight * 1.2 : monthHeight * 0.9}
          fontSize={(emphasize) ? monthHeight * 2 : monthHeight * 1.4}
          textAnchor='end'
          filter={(deemphasize) ? 'url(#grayscale)' : null}
          className={(active) ? 'active' : ''}
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
          //fill={c.fill}
          strokeWidth={0}
          className='cell'
          key={`cellFor${c.year}${c.month}`}
          filter={(c.inSelection && !deemphasize) ? null : 'url(#grayscale)'}
        />
      ))}

      {/* a transparent hoverable and selectable rect that covers the whole element */}
      {(active) && (
        <Link
          to={to}
        >
          <rect
            x={labelX - monthWidth * 12}
            y={-1.5}
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

export default TimelineRow;

TimelineRow.propTypes = {
  firstname: PropTypes.string,
};

TimelineRow.defaultProps = {
  
};
