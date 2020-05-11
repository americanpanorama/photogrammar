import React from 'react';
import { useFetch } from 'react-async';
import PropTypes from 'prop-types';
import SidebarHeader from './SidebarHeader.js';

const FetchPhotoCount = ({ query, nationalCount, filterTerms, clearFilterTerms }) => {
  if (query) {
    const { data, error } = useFetch(query, {
      headers: { accept: "application/json" },
    });

    if (error) {
      return null;
    }

    // if (error) return error.message
    if (data) {
      if (data.rows[0].count === 0) {
        return (
          <header className="highlight-text">
            <h3 className='noPhotos'>
              {`No photos ${(filterTerms.length > 0) ? `for "${filterTerms.join(' ')}"` : ''}`}
            </h3>
            {(filterTerms.length > 0) && (
              <button
                onClick={clearFilterTerms}
                className='clearSearch'
              >
                clear search
              </button>
            )}
          </header>
        );
      }

      return (
        <SidebarHeader
          count={data.rows[0].count}
        />
      );
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

