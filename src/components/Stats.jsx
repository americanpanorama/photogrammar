import React from 'react';
import PropTypes from 'prop-types';
import './Stats.css';

const Stats = ({ placeName, numPhotographs, photographers }) => {
  if (!placeName && !numPhotographs) {
    return null;
  }

  return (
    <div className='placeStats'>
      <h4>Location</h4>
      <div>
        {placeName}
      </div>

      <h4>Photographs Taken</h4>
      <div>
        {numPhotographs.toLocaleString()}
      </div>

      {(photographers) && (
        <React.Fragment>
          <h4>Active Photographers</h4>

          <div>
            {photographers.map(p => (
              <span
                className='activePhotographer'
                id={p.key}
                key={`activePhotographer${p.key}`}
              >
                {`${p.name} (${p.photoCount.toLocaleString()})`}
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
