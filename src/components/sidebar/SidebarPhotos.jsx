import React from 'react';
import PropTypes from 'prop-types';
// import LazyLoad from 'react-lazyload';
import { Link } from "react-router-dom";
import './SidebarPhotos.css';

const SidebarPhotos = ({ photos, selectedPhotoCallNumber }) => {
  return (
    <div id="sidebar-photos">
      <div className="highlight-text">
        <a href="#">Photographs based on national level</a>
      </div>
      {photos.map(photo => (
        <div
          key={photo.call_number}
          className="col-sm-4 col-md-4 col-lg-4"
        >
          <Link
            to={`/photo/${photo.call_number}`}
          >
            <div
              className={(selectedPhotoCallNumber && selectedPhotoCallNumber !== photo.call_number)
                ? 'post notSelected' : 'post'}
            >
              <div className="post-media">
                <img
                  src={`http://photogrammar.yale.edu/photos/service/pnp/${photo.img_thumb_img}`}
                  alt={photo.caption}
                />
              </div>
              <div className="post-entry">
                <p>{photo.caption}</p>
                <p>{`${photo.county}, ${photo.state}`}</p>
              </div>
              <div className="post-entry-photographer">
                <p>{photo.photographers_name}</p>
                <p>{`${photo.month}-${photo.year}`}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SidebarPhotos;

SidebarPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
  selectedPhotoCallNumber: PropTypes.string,
};

SidebarPhotos.defaultProps = {
  selectedPhotoCallNumber: null
};

