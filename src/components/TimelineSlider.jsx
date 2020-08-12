import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as d3 from 'd3';
import './TimelineSlider.css';
import 'rc-slider/assets/index.css';

const TimelineSlider = ({timeRange, width, leftAxisWidth, setTimeRange, makeLink}) => {
  const monthNum = m => (m - 1) / 12;
  const numToMonth = num => Math.round(num * 12) + 1;
  const x = d3.scaleLinear()
    .domain([1935, 1944 + monthNum(6)])
    .range([0, 100]);
  const marks = {};
  [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944].forEach(y => {
    marks[x(y)] = {
      label: y
    };
  });
  const step = x(1935 + monthNum(2)) - x(1935);

  const onRangeChange = (xs) => {
    const timeRange = xs.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    });
    setTimeRange(timeRange);
  };

  const onAfterChange = (xs) => {
    const timeRange = xs.map(anX => {
      const dateNum = x.invert(anX);
      const rawMonth = numToMonth(dateNum % 1);
      const year = (rawMonth === 13) ? Math.floor(dateNum) + 1 : Math.floor(dateNum);
      const month = (rawMonth === 13) ? 1 : rawMonth;
      return year * 100 + month;
    });
    const link = makeLink([{
      type: 'set_time_range',
      payload: timeRange,
    }]);
    // this updates the url without reloading
    history.pushState({}, '', `${process.env.PUBLIC_URL}${link}`)
  }

  const defaultValue = [
    x(Math.floor(timeRange[0] / 100) + monthNum(timeRange[0] % 100)),
    x(Math.floor(timeRange[1] / 100) + monthNum(timeRange[1] % 100)),
  ];

  return (
    <div
      className='timelineSlider'
      style={{
        width: width,
        marginLeft: leftAxisWidth,
      }}
    >
      <Range
        allowCross={false}
        value={defaultValue}
        onChange={onRangeChange} 
        onAfterChange={onAfterChange}
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
        //onAfterChange={onRangeChange}
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
