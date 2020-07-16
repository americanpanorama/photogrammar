import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from "react-router-dom";
//import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import TreemapTheme from './TreemapTheme2.jsx';
import { buildLink } from '../helpers.js';
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
        setIsLoading(false);
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

const Treemap = ({ themes, name, ancestors, height, width, selectedTheme}) => {
  const ref = useRef();

  return (
    <div
      className='treemap'
      style={{
        width: width,
        height: height,
        position: 'relative'
      }}
    >
      <ul className='breadcrumbs'>
        {(selectedTheme !== 'root') &&
          <li>
            <Link
              to={`/themes`}
            >
              Top
            </Link>
          </li>
        }
        {ancestors.map(ancestor => (
          <li
            key={ancestor.key}
          >
            <Link
              to={`/themes/${ancestor.key}`}
            >
              {ancestor.name}
            </Link>
          </li>
        ))}
      </ul>
      {themes.map(cat => (
          <TreemapTheme
            {...cat}
            key={cat.id}
          />
      ))}

      <label
        className='explanation'
        title='Visualization of the classification system designed by Paul Vanderbilt in 1942. It is a three-tier classification starting with 12 main subject headings (ex. THE LAND), then 1300 sub-headings (ex. Mountains, Deserts, Foothills, Plains) and then sub-sub headings. 88,000 photographs were assigned classifications.'
      >
        1942 Classification System
      </label>

    </div>
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
          themes={themes}
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
