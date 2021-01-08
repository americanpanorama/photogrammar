import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './SimilarPhotoCard.css';

const SimilarPhotoCard = ({ photo, height, width }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  console.log(height);

  return (
    <Link
      to={`/photo/${photo.loc_item_link}`}
      className='similarPhotoCardLink'
    >
      <div
        className="similarPhotoCard"
        style={{
          height,
          width,
        }}
      >
        <div className='captions'>
          {photo.caption}
        </div>
        <div className='photographerPlace'>
          {`${(photo.photographer_name) ? `${photo.photographer_name},` : ''} ${(photo.month) ? monthNames[parseInt(photo.month, 10) - 1] : ''} ${(photo.year) ? photo.year : ''}`}
        </div>
        <div className="thumbnail">
          <img
            src={`//s3.amazonaws.com/dsl-general/photogrammar/${photo.img_thumb_img}`}
            alt={photo.caption}
          />
        </div>
      </div>
    </Link>
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
