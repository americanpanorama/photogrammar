import React from 'react';
import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import SidebarHeader from './SidebarHeader.js';

const FetchPhotoCount = ({ query, nationalCount }) => {
  if (query) {
    const { data, error } = useFetch(query, {
      headers: { accept: "application/json" },
    });

    if (error) {
      return null;
    }

    // if (error) return error.message
    if (data) {
      return (
        <SidebarHeader
          count={data.rows[0].count}
        />
      )
    }
  } 
  return (
    <SidebarHeader
      count={nationalCount}
    />
  );
};

export default FetchPhotoCount;

FetchPhotoCount.propTypes = {
  query: PropTypes.string,
};

FetchPhotoCount.defaultProps = {
  query: null,
};

