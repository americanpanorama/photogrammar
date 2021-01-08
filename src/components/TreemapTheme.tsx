import React from 'react';
import { Link } from "react-router-dom";
import * as d3 from 'd3';
import { TreemapThemeProps } from '../index.d';

const TreemapTheme = (props: TreemapThemeProps) => {
  const {
    width,
    height,
    transformX: translateX,
    transformY: translateY,
    name,
    fill,
    fillOpacity,
    strokeWidth,
    fontColor,
    id,
    link,
    imgSrc,
    deemphasize,
  } = props;

  const estimateWidth = (str: string, fontSize: number): number => str.length * fontSize * 0.5;

  // reverse it as the y offset is negative
  const fontSize = Math.min(20, Math.max(8, height / 4));
  const textShadowDistance = fontSize / 7;
  const margin = Math.max(width / 50, height / 50);

  return (
    <Link
      to={`/themes/${link}`}
      className='theme'
    >
      <div
        className='box'
        style={{

          top: translateY + margin / 2,
          left: translateX + margin / 2,
          width: width - strokeWidth * 3 - margin,
          height: height - margin,
          backgroundColor: fill,
          backgroundImage: `url(//s3.amazonaws.com/dsl-general/photogrammar/${imgSrc})`,

          borderLeft: `${strokeWidth * 3}px ${fill} solid`,
        }}
      >
        <label
          style={{
            fontSize,
            color: fontColor,
            textShadow: (!deemphasize) ? `${textShadowDistance}px ${textShadowDistance}px ${textShadowDistance * 2}px black, -${textShadowDistance}px -${textShadowDistance}px ${textShadowDistance * 2}px black, -${textShadowDistance}px ${textShadowDistance}px ${textShadowDistance * 2}px black, ${textShadowDistance}px -${textShadowDistance}px ${textShadowDistance * 2}px black` : 'none',
          }}
        >
          {name}
        </label>
      </div>
    </Link>
  );
};

export default TreemapTheme;
