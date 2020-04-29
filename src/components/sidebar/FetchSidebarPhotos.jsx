import React from 'react';
import { useFetch } from 'react-async';
import he from 'he';
import PropTypes from 'prop-types';
import SidebarPhotos from './SidebarPhotos.js';

const FetchSidebarPhotos = ({ query }) => {
  if (query) {
    const { data, error } = useFetch(query, {
      headers: { accept: "application/json" },
    });

    if (error) {
      return null;
    }

    // if (error) return error.message
    if (data) {
      data.rows = data.rows.map(sp => ({
        ...sp,
        caption: he.decode(sp.caption),
      }))

      if (data.rows.length === 0) {
        return null;
      }
      return (
        <SidebarPhotos
          photos={data.rows}
        />
      )
    }
  }

  return null;
};

export default FetchSidebarPhotos;

FetchSidebarPhotos.propTypes = {
  query: PropTypes.string,
};

FetchSidebarPhotos.defaultProps = {
  query: null,
};

