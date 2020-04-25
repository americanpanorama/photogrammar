import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useParams } from "react-router-dom";
//import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import TreemapTheme from './TreemapTheme.jsx';
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

const Treemap = ({ themes, name, ancestors, height, width, selectedTheme, selectedViz, selectTheme, selectViz }) => {
  const ref = useRef();

  let { themeKey } = useParams();
  if (!themeKey) {
    themeKey = 'root';
  }

  if (selectedViz !== 'themes') {
    selectViz('themes');
  }

  if (themeKey && themeKey !== selectedTheme) {
    selectTheme(themeKey);
  }

  return (
    <svg
      width={width}
      height={height}
      className='treemap'
    >
      <text
        x={width - 5}
        y={16}
        textAnchor='end'
      >
        1942 Classification System
        <title>
          Visualization of the classification system designed by Paul Vanderbilt in 1942. It is a three-tier classification starting with 12 main subject headings (ex. THE LAND), then 1300 sub-headings (ex. Mountains, Deserts, Foothills, Plains) and then sub-sub headings. 88,000 photographs were assigned classifications.
        </title>
      </text>
      <text
        x={5}
        y={16}
        className='treePath'
      >
        {(selectedTheme !== 'root') &&
          <Link
            to={`/themes`}
          >
            <tspan>
              Top
            </tspan>
          </Link>
        }
        {ancestors.map(ancestor => (
          <React.Fragment
            key={ancestor.key}
          >
            <tspan
              dx={10}
            >
              /
            </tspan>
            <Link
              to={`/themes/${ancestor.key}`}
            >
              <tspan
                dx={10}
                //onClick={selectTheme}
                id={ancestor.key}
                
              >
                {ancestor.name}
              </tspan>
            </Link>
          </React.Fragment>
        ))}
        {(false && selectedTheme !== 'root') &&
          <Fragment>
            <tspan
              dx={10}
            >
              /
            </tspan>
            <tspan
              dx={10}
            >
              {name}
            </tspan>
          </Fragment>
        }
      </text>
      <rect
        y={20}
        width={width}
        height={height - 20}
        fill='#999'
      />
      <g>
        {themes.map(cat => (
          <TreemapTheme
            {...cat}
            key={cat.id}
          />
        ))}
      </g>
    </svg>
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
