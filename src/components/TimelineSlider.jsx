import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as d3 from 'd3';
import './TimelineSlider.css';
import 'rc-slider/assets/index.css';


const TimelineSlider = ({setTimeRange}) => {
  const monthNum = m => (m - 1) / 12;
  const numToMonth = num => Math.round(num * 12) + 1;
  const x = d3.scaleLinear()
    .domain([1935, 1945 + monthNum(3)])
    .range([0, 100]);
  const marks = {};
  [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1944, 1945].forEach(y => {
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
      <div className='timelineSlider'>
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
              backgroundColor: 'black',
            },
            {
              borderColor: 'black',
              backgroundColor: 'black',
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
