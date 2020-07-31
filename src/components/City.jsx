import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Link } from "react-router-dom";

const City = (props) => {
  const {
    id,
    cx,
    cy,
    fillOpacity,
    stroke,
    name,
    scale,
    selectedCity,
    linkActive,
    onCityHover,
    onCityUnhover,
  } = props;

  const ref = useRef(false);
  const isInitialMount = useRef(true);

  const [r, setR] = useState(props.r);
  const [strokeWidth, setStrokeWidth] = useState(props.strokeWidth);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (props.r === 0) {
        d3.select(ref.current)
          .attr("r", props.r)
          .style("stroke-width", props.strokeWidth)
          .on("end", () => {
            setR(props.r);
            setStrokeWidth(props.strokeWidth)
          });
      } else {
        d3.select(ref.current)
          .transition()
          .duration(1000)
          .attr("r", props.r)
          .style("stroke-width", props.strokeWidth)
          .on("end", () => {
            setR(props.r);
            setStrokeWidth(props.strokeWidth)
          });
      }
    }
  }, [props.r, props.strokeWidth]);

  const onHover = (e) => {
    onCityHover(id);
  }

  const onUnhover = (e) => {
    onCityUnhover();
  }

  return (
    <Link
      to={`/city/${id}`}
      onClick={(!linkActive) ? e => e.preventDefault() : () => {}}
      id={id}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='#289261'
        stroke={stroke}
        fillOpacity={fillOpacity}
        style={{
          strokeWidth,
        }}
        onMouseEnter={() => { onCityHover(id) }}
        onMouseLeave={onUnhover}
        ref={ref}
      />
    </Link>
  );
};

export default City;

City.propTypes = {
  cx: PropTypes.number.isRequired,
};

City.defaultProps = {
  
};
