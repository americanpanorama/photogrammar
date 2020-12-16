import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Link } from "react-router-dom";
import { StyledCity } from '../index.d';

interface Props extends StyledCity {
  linkActive: boolean;
  makeLink([]: { type: string, payload: string}[]): string;
  onCityHover(arg0: string): void;
  onCityUnhover(): void;
}

const City = (props: Props) => {
  const {
    id,
    cx,
    cy,
    fillOpacity,
    stroke,
    name,
    linkActive,
    makeLink,
    onCityHover,
    onCityUnhover,
  } = props;

  const ref = useRef();
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

  const onHover = () => {
    onCityHover(id);
  }

  const onUnhover = () => {
    onCityUnhover();
  }

  const link = makeLink([{
    type: 'set_city',
    payload: id,
  }]);

  return (
    <Link
      to={`/city/${id}`}
      onClick={(!linkActive) ? e => e.preventDefault() : () => {}}
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
