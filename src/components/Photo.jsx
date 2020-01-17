import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";
import './Photo.css';

const Photo = ({ photoMetadata, selectPhoto, selectPhotographer }) => {
  const { id: loc_item_link } = useParams();
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
  return (
    <div className="row multi-columns-row">
      <div className="photo-details">
        <div className="col-sm-3 col-md-3 col-lg-3">
          <div className="caption-text">
            <p>{`${photographer_name} - ${city || county}, ${state}`}</p>
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
            <p>{`${month} ${year}`}</p>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="image-caption">
            <img src={`http://photogrammar.yale.edu/photos/service/pnp/${img_large_path}`} alt="" />
          </div>
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
