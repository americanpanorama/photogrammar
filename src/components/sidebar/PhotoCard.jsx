import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './PhotoCard.css';

const PhotoCard = ({ photo, selectedPhotograph }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return (
    <div
      key={photo.loc_item_link}
      className="photoCard"
    >
      <Link
        to={`${process.env.PUBLIC_URL}/photo/${encodeURIComponent(photo.loc_item_link)}`}
      >
        <div
          className={(!selectedPhotograph || selectedPhotograph === photo.loc_item_link) ? '' : 'notSelected'}
        >
          <div className="thumbnail">
            {(photo.img_thumb_img) ? (
              <img
                src={`http://photogrammar.yale.edu/photos/service/pnp/${photo.img_thumb_img}`}
                alt={photo.caption}
              />
            ) : (
              <div className='noimage'>no image</div>
            )}
          </div>
          <div className="post-entry-caption">
            {photo.caption}
          </div>
          <div className="post-entry-location">
            {(photo.county && photo.state) ? `${photo.county}, ${photo.state}` : null}
          </div>
          <div className="post-entry-photographer">
            {photo.photographer_name}
          </div>
          <div className="post-entry-date">
            {`${monthNames[parseInt(photo.month, 10) - 1]} ${photo.year}`}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PhotoCard;

PhotoCard.propTypes = {
  photo: PropTypes.object,
  selectedPhotograph: PropTypes.string,
};

PhotoCard.defaultProps = {
  selectedPhotograph: null,
};
