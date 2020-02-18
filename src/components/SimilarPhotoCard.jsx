import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './SimilarPhotoCard.css';

const SimilarPhotoCard = ({ photo }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div
      className="similarPhotoCard"
    >
      <Link
        to={`${process.env.PUBLIC_URL}/photo/${encodeURIComponent(photo.loc_item_link)}`}
      >
        <h4>
          {`${(photo.photographer_name) ? `${photo.photographer_name},` : ''} ${(photo.month) ? monthNames[parseInt(photo.month, 10) - 1] : ''} ${(photo.year) ? photo.year : ''}`}
        </h4>
        <div>
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
          <div className='captions'>
            {photo.caption}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SimilarPhotoCard;

SimilarPhotoCard.propTypes = {
  photo: PropTypes.object,
  selectedPhotograph: PropTypes.string,
};

SimilarPhotoCard.defaultProps = {
  selectedPhotograph: null,
};
