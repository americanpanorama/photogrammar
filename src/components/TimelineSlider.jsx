import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as d3 from 'd3';
import './TimelineSlider.css';
import 'rc-slider/assets/index.css';


const TimelineSlider = ({width, leftAxisWidth, setTimeRange}) => {
  const monthNum = m => (m - 1) / 12;
  const numToMonth = num => Math.round(num * 12) + 1;
  const x = d3.scaleLinear()
    .domain([1935, 1944 + monthNum(6)])
    .range([0, 100]);
  const marks = {};
  [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1944].forEach(y => {
    marks[x(y)] = {
      label: y
    };
  });
  const step = x(1935 + monthNum(2)) - x(1935);

  const onRangeChange = (xs) => {
    setTimeRange(xs.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    }));
  }

  return (
      <div
        className='timelineSlider'
        style={{
          width: width - leftAxisWidth,
          marginLeft: leftAxisWidth,
        }}
      >
        <Range
          allowCross={false}
          defaultValue={[0, 100]}
          onChange={() => false} 
          marks={marks}
          step={step}
          trackStyle={[{
            backgroundColor: 'black',
          }]}
          handleStyle={[
            {
              borderColor: 'black',
              backgroundColor: 'yellow',
            },
            {
              borderColor: 'black',
              backgroundColor: 'yellow',
            },
          ]} 
          activeDotStyle={{
            borderColor: 'black',
          }}
          onAfterChange={onRangeChange}
        />
      </div>
  );
};

export default TimelineSlider;

TimelineSlider.propTypes = {
  setTimeRange: PropTypes.func.isRequired,
};

TimelineSlider.defaultProps = {
  
};
