import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './PhotoCard.css';

const PhotoCard = (props) => {
  const {
    photo,
    selectedPhotograph,
    width,
    height,
    interiorWidth,
    interiorHeight,
    margin,
    padding,
    borderWidth,
    scale,
    selectedMapView,
    buildLink,
  } = props;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const {
    img_thumb_img,
    loc_item_link,
    caption,
    city,
    county,
    state,
    stateAbbr,
    photographer_name,
    month,
    year
  } = photo;

  let location = state || '';
  if (selectedMapView === 'counties' && county && stateAbbr) {
    location = `${county}, ${stateAbbr}`;
  }
  if (selectedMapView === 'cities' && city && stateAbbr) {
    location = `${city}, ${stateAbbr}`;
  }

  const linkTo = buildLink({
    replaceOrAdd: [{
      param: 'photo',
      value: loc_item_link,
    }],
  });

  return (
    <div
      key={loc_item_link}
      className={`photoCard ${(selectedPhotograph === loc_item_link) ? 'selected' : 'notSelected'}`}
      style={{
        width: width,
        height: height,
        padding: 0,
        borderWidth: borderWidth,
        transform: `scale(${scale})`,
      }}
    >
      <Link
        to={linkTo}
      >
        <div
          style={{
            height: interiorHeight,
            padding: padding,
            width: interiorWidth,
            fontSize: interiorHeight * 0.06,
          }}
        >
          {(img_thumb_img) ? (
            <div
              className="thumbnail"
              style={{
                backgroundImage: `url(http://photogrammar.yale.edu/photos/service/pnp/${img_thumb_img})`,
              }}
            />
          ) : (
            <div
              className='thumbnail'
            >
              <div
                className='noimage'
              >
                no image
              </div>
            </div>
          )}
          <div
            className="post-entry-caption"
            style={{
              maxWidth: interiorWidth,
            }}
          >
            {caption}
          </div>
          <div className="post-entry-location">
            {location}
          </div>
          <div className="post-entry-photographer">
            {photographer_name}
          </div>
          <div className="post-entry-date">
            {`${(month) ? monthNames[parseInt(month, 10) - 1] : ''} ${(year) ? year : ''}`}
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
  scale: PropTypes.number,
};

PhotoCard.defaultProps = {
  selectedPhotograph: null,
  scale: 1,
};
