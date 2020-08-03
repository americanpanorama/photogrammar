import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const TreemapTheme = (props) => {
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

  const estimateWidth = (str, fontSize) => str.length * fontSize * 0.5;

  // const fontSize = Math.max(10, Math.min(20, 20 * width / 200));
  // let tspans = [name];
  // if (estimateWidth(name, fontSize) > width * 0.8) {
  //   // how many words
  //   const words = name.split(' ');
  //   if (words.length > 1) {
  //     // 
  //     tspans = [words[0]];
  //     words.slice(1).forEach(word => {
  //       const lengthIfAdded = estimateWidth(`${tspans[tspans.length -1 ]} ${word}`, fontSize);
  //       if (lengthIfAdded < width * 0.8) {
  //         tspans[tspans.length -1] = `${tspans[tspans.length -1]} ${word}`;
  //       } else {
  //         tspans.push(word);
  //       }
  //     });
  //   }
  // }

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
          backgroundImage: `url(http://photogrammar.yale.edu/photos/service/pnp/${imgSrc})`,

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

TreemapTheme.propTypes = {
  transformX: PropTypes.number,
};

TreemapTheme.defaultProps = {
  
};
