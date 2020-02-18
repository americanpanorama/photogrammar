import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useParams, useHistory } from "react-router-dom";
import SimilarPhotoCard from './SimilarPhotoCard.jsx';
import USOutline from '../../public/data/us_outline.json';
import './Photo.css';

const Photo = ({ photoMetadata, centroid, selectPhoto, selectPhotographer }) => {
  const { id: loc_item_link } = useParams();
  let history = useHistory();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  if (!photoMetadata || photoMetadata.loc_item_link !== decodeURIComponent(loc_item_link)) {
    selectPhoto(loc_item_link);
    return null;
  }
  const {
    photographer_name,
    caption,
    year,
    month,
    city,
    county,
    state,
    // longitude,
    // latitude,
    img_large_path,
  } = photoMetadata;

  const projection = d3.geoAlbersUsa()
    .translate([200, 100])
    .scale(250);
  const path = d3.geoPath(projection); 

  let date = 'N/A';
  if (month && year) {
    date = `${monthNames[month]} ${year}`;
  } else if (year) {
    date = year;
  }

  return (
    <div className="selectedPhoto">
      <div className='close'>
        <button onClick={() => history.goBack()}>
          {'<'}
        </button>
      </div>
      <div className="metadata">
        <div className="caption-text">
          <p>Caption (Original Description)</p>
        </div>
        <div className="caption-text-description">
          <p>{caption}</p>
        </div>

        <div className="caption-text">
          <p>Photographer</p>
        </div>
        <div className="caption-text-description">
          <p>{photographer_name}</p>
        </div>

        <div className="caption-text">
          <p>Created</p>
        </div>
        <div className="caption-text-description">
          <p>{date}</p>
        </div>

        <div className="caption-text">
          <p>Location</p>
        </div>
        <div className="caption-text-description">
          <p>{`${county}, ${state}`}</p>
          <svg
            width={400}
            height={200}
            className='map'
          >
            <path
              d={path(USOutline)}
              style={{
                fill: 'grey',
                stroke: 'transparent',
                strokeWidth: 0,
              }}
            />
            {(centroid) && (
              <circle
                cx={projection(centroid)[0]}
                cy={projection(centroid)[1]}
                r={4}
                fill='lime'
              />
            )}
          </svg>
        </div>
      </div>
      <div className="img">
        <img src={`http://photogrammar.yale.edu/photos/service/pnp/${img_large_path}`} alt="" />
      </div>
      <div className='similarPhotos'>
        <h2>Similar Photos</h2>
        <div className='cards'>
          {photoMetadata.similarPhotos.map(sp => (
            <SimilarPhotoCard
              photo={sp}
              key={sp.loc_item_link}
            />
          ))}
        </div>
      </div>
    </div>

    


  );
};

export default Photo;

Photo.propTypes = {
  photoMetadata: PropTypes.object,
  selectPhoto: PropTypes.func.isRequired,
  selectPhotographer: PropTypes.func.isRequired,
};

Photo.defaultProps = {
  photoMetadata: null,
};
