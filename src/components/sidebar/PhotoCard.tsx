import * as React from 'react';
import { Link } from "react-router-dom";
import './PhotoCard.css';
import { Props } from './PhotoCard.d';

const PhotoCard = (props: Props) => {
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
    makeLink,
  } = props;

  const monthNames: string[] = ["January", "February", "March", "April", "May", "June",
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
  if (stateAbbr && stateAbbr === 'DC') {
    location = 'Washington, DC';
  } else if (selectedMapView === 'counties' && county && stateAbbr) {
    location = `${county}, ${stateAbbr}`;
  }
  if (selectedMapView === 'cities' && city && stateAbbr) {
    location = `${city}, ${stateAbbr}`;
  }

  const linkTo = makeLink([{
    type: 'set_photo',
    payload: loc_item_link,
  }]);

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
                backgroundImage: `url(//s3.amazonaws.com/dsl-general/photogrammar/${img_thumb_img})`,
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
            {`${(month) ? monthNames[month- 1] : ''} ${(year) ? year : ''}`}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PhotoCard;
