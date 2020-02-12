import React from 'react';
import PropTypes from 'prop-types';
import { useFetch } from 'react-async';
import './Stats.css';

const Stats = ({ placeName, numPhotographs, photographers, photoCountQuery, photographersCountQuery }) => {
  if (!placeName && !numPhotographs) {
    return null;
  }

  let photoCount = numPhotographs;

  if (photoCountQuery) {
    const { data, error } = useFetch(photoCountQuery, {
      headers: { accept: "application/json" },
    });

    if (error) {
      return null;
    }

    if (data) {
      photoCount = data.rows[0].count;
    }
  }

  let photographersData = [];
  if (photographersCountQuery) {
    const { data: pd, error: photographersError } = useFetch(photographersCountQuery, {
      headers: { accept: "application/json" },
    });

    if (photographersError) {
      return null;
    }

    if (pd) {
      photographersData = pd.rows;
    }
  }

  return (
    <div className='placeStats'>
      <h4>Location</h4>
      <div>
        {placeName}
      </div>

      <h4>Photographs Taken</h4>
      <div>
        {photoCount.toLocaleString()}
      </div>

      {(photographers) && (
        <React.Fragment>
          <h4>Active Photographers</h4>

          <div>
            {photographersData.map(p => (
              <span
                className='activePhotographer'
                id={p.photographer_name.replace(/\s/g, "")}
                key={`activePhotographer${p.photographer_name}`}
              >
                {`${p.photographer_name} (${p.count.toLocaleString()})`}
              </span>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Stats;

Stats.propTypes = {
  placeName: PropTypes.string,
  numPhotographs: PropTypes.number,
};

Stats.defaultProps = {
  placeName: undefined,
  numPhotographs: undefined,
};
