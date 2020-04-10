import React, { useState, useEffect, useRef } from 'react';
//import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import './Treemap.css';

const useFetch = (url, options) => {
  const lastQuery = useRef(null);
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
        setIsLoading(false)
      } catch (error) {
        setError(error);
      }
    };
    if (url !== lastQuery.current) {
      lastQuery.current = url;
      fetchData();
    }
  });
  return { response, error, isLoading };
};

const Treemap = ({ themes, ancestors, height, width, selectedTheme, selectTheme }) => {
  const ref = useRef();

  console.log(ancestors);

  const estimateWidth = (str, fontSize) => str.length * fontSize * 0.5;

  const strokeWidth = 5;

  return (
    <React.Fragment>
      <ul>
        {(selectedTheme !== 'root') &&
          <li
            onClick={selectTheme}
            id={'root'}
          >
            Top
          </li>
        }
        {ancestors.map(ancestor => (
          <li
            onClick={selectTheme}
            id={ancestor.key}
            key={ancestor.key}
          >
            {ancestor.name}
          </li>
        ))}
      </ul>
      <svg
        width={width}
        height={height}
        className='treemap'
      >
        <g>
          {themes.map(cat => {
            const { name } = cat;
            const fontSize = Math.max(10, Math.min(20, 20 * cat.width / 200));
            let tspans = [cat.name];
            if (estimateWidth(name, fontSize) > cat.width * 0.8) {
              // how many words
              const words = name.split(' ');
              if (words.length > 1) {
                // 
                tspans = [words[0]];
                words.slice(1).forEach(word => {
                  const lengthIfAdded = estimateWidth(`${tspans[tspans.length -1 ]} ${word}`, fontSize);
                  if (lengthIfAdded < cat.width * 0.8) {
                    tspans[tspans.length -1] = `${tspans[tspans.length -1]} ${word}`;
                  } else {
                    tspans.push(word);
                  }
                });
              }
            }
            return (
              <g 
                transform={`translate(${cat.transformX} ${cat.transformY})`}
                key={`${selectedTheme}|${name}`}
                onClick={selectTheme}
                id={`${selectedTheme}|${name}`}
                ref={ref}
              >
                {(cat.imgSrc) && (
                  <image
                    xlinkHref={`http://photogrammar.yale.edu/photos/service/pnp/${cat.imgSrc}`}
                    width={cat.width}
                    height={cat.height}
                    x={0}
                    y={0}
                    preserveAspectRatio='xMidYMid slice'
                  />
                )}
                <rect
                  x={strokeWidth / 2}
                  y={strokeWidth / 2}
                  width={cat.width - strokeWidth}
                  height={cat.height - strokeWidth}
                  fill={cat.fill}
                  fillOpacity='0.11'
                  stroke={cat.fill}
                  strokeWidth={strokeWidth}
                  
                />
                <g transform={`translate(${cat.width / 2} ${cat.height * 0.7 - fontSize * 1.1 * (tspans.length - 1)})`}>
                  <text
                    x={0}
                    y={0}
                    fontSize={fontSize}
                    textAnchor='middle'
                    fill='white'
                    stroke={'black'}
                    strokeWidth={4}
                    strokeOpacity={0.6}
                  >
                    {(tspans.map((labelPart, i) => (
                      <tspan
                        x="0"
                        textAnchor="middle"
                        dy={fontSize * 1.1}
                        key={labelPart}
                      >
                        {labelPart}
                      </tspan>
                    )))}
                  </text>
                  <text
                    x={0}
                    y={0}
                    fontSize={fontSize}
                    textAnchor='middle'
                    fill='white'
                    
                  >
                    {(tspans.map((labelPart, i) => (
                      <tspan
                        x="0"
                        textAnchor="middle"
                        dy={fontSize * 1.1}
                        key={labelPart}
                      >
                        {labelPart}
                      </tspan>
                    )))}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </React.Fragment>
  );
};

const FetchTreemapImages = (props) => {
  const { themes, query } = props;

  if (query) {
    const res = useFetch(query, {
      headers: { accept: "application/json" },
    });

    if (!res.response) {
      return (
        <Treemap
          {...props}
        />
      );
    }

    res.response.rows.forEach(imgData => {
      const themeIdx = themes.findIndex(theme => { return theme.name === imgData.theme});
      if (themeIdx !== -1) {
        themes[themeIdx].imgSrc = imgData.img;
      }
    });

    return (
      <Treemap
        {...props}
        themes={themes}
      />
    );
  } 
  return (
    <Treemap
      {...props}
      themes={themes}
    />
  );
};

FetchTreemapImages.propTypes = {
  query: PropTypes.string,
};

FetchTreemapImages.defaultProps = {
  query: null,
};

export default FetchTreemapImages;

Treemap.propTypes = {
};
 Treemap.defaultProps = {
  
};
