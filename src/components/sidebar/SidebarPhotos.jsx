import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import PhotoCard from './PhotoCard.js';
import './SidebarPhotos.css';


const SidebarPhotos = ({ photos, sidebarPhotosOffset, selectedPhotographer, selectedPhotographerName, header, selectedCounty, selectedState, selectedStateName, previousOffset, nextOffset, displayableCards, sidebarWidth, randomPhotoNumbers, loadSidebarPhotos }) => {
  console.log(photos);
  const newPhotoSet = {
    photos,
    setId: `${(selectedPhotographer) ? selectedPhotographer : ''}${(selectedCounty) ? selectedCounty : ''}${(selectedState) ? selectedState : ''}`,
    offset: sidebarPhotosOffset,
  };
  const [photoSet, setPhotoSet] = useState(newPhotoSet);
  const sidebarPhotosRef = useRef();

  // if the next or previous set of photos are passed in, add a new set, slide right or left to show it, and update the state with the new set
  useEffect((() => {
    const photoContainer = d3
      .select(sidebarPhotosRef.current)
    if (photoContainer.selectAll('.photoPage').size() === 2) {
      const newMarginLeft = (photoSet.offset < sidebarPhotosOffset) ? sidebarWidth * -1 : 0;
      photoContainer
        .transition()
        .duration(750)
        .style('margin-left', `${newMarginLeft}px`)
        .on("end", () => {
          const newPhotoSet = {
            photos,
            setId: `${(selectedPhotographer) ? selectedPhotographer : ''}${(selectedCounty) ? selectedCounty : ''}`,
            offset: sidebarPhotosOffset,
          };
          setPhotoSet(newPhotoSet);
          photoContainer.style('margin-left', 0)
        });
    }
  }));


  // see if the new photos are of the same type and if it's the previous or next group
  const photoSets = [newPhotoSet];
  let marginLeft = 0;
  if (photoSet.setId === newPhotoSet.setId && Math.abs(newPhotoSet.offset - photoSet.offset) === displayableCards) {
    // add a temporary set for scrolling
    if (newPhotoSet.offset > photoSet.offset) {
      photoSets.unshift(photoSet);
    } else {
      photoSets.push(photoSet);
      marginLeft = sidebarWidth * -1;
    }
  } else if (photoSet.setId !== newPhotoSet.setId) {
    setPhotoSet(newPhotoSet);
  }
  return (
    <div id="sidebar">
      <header className="highlight-text">
        <h3>
          {header}
        </h3>
        <div className='timeAndNav'>
          <h4>
            time
          </h4>
          <h4 className='counts'>
            {`${sidebarPhotosOffset + 1}-${sidebarPhotosOffset + displayableCards} of num`}
          </h4>
          <nav>
            {(previousOffset >= 0) && (
              <button
                onClick={loadSidebarPhotos}
                id={previousOffset}
              >
                {'<'}
              </button>
            )}
            {(nextOffset >= 0) && (
              <button
                onClick={loadSidebarPhotos}
                id={nextOffset}
              >
                {'>'}
              </button>
            )}
          </nav>
        </div>
      </header>
      <div
        id="sidebar-photos"
        ref={sidebarPhotosRef}
        style={{
          marginLeft,
        }}
      >
        {photoSets.map(ps => (
          <div
            className='photoPage'
            key={`${ps.setId}-${ps.offset}`}
          >
            {ps.photos.map(photo => (
              <PhotoCard
                key={photo.loc_item_link}
                photo={photo}
                //notSelected={selectedPhotoCallNumber && selectedPhotoCallNumber !== photo.call_number}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

};

export default SidebarPhotos;

SidebarPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
};

SidebarPhotos.defaultProps = {
};

