import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import PhotoCard from './PhotoCard.js';
import './SidebarPhotos.css';

const SidebarPhotos = ({ photos, sidebarPhotosOffset, photoSetId, displayableCards, sidebarWidth, blankCardWidth, blankCardHeight }) => {
  const newPhotoSet = {
    photos,
    setId: photoSetId,
    offset: sidebarPhotosOffset,
  };
  const [photoSet, setPhotoSet] = useState(newPhotoSet);
  const sidebarPhotosRef = useRef();

  // if the next or previous set of photos are passed in, add a new set, slide right or left to show it, and update the state with the new set
  useEffect((() => {
    const photoContainer = d3.select(sidebarPhotosRef.current);
    if (photoContainer.selectAll('.photoPage').size() === 2) {
      const newMarginLeft = (photoSet.offset < sidebarPhotosOffset) ? sidebarWidth * -1 : 0;
      photoContainer
        .transition()
        .duration(750)
        .style('margin-left', `${newMarginLeft}px`)
        .on('end', () => {
          const newPhotoSet = {
            photos,
            setId: photoSetId,
            offset: sidebarPhotosOffset,
          };
          setPhotoSet(newPhotoSet);
          photoContainer.style('margin-left', 0);
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

  const blankCardsCount = (photoSets.length >= 1 && photoSets[photoSets.length - 1].photos)
    ? [...Array(Math.max(0, displayableCards - photoSets[photoSets.length - 1].photos.length)).keys()] : [];

  return (
    <div
      id="sidebar-photos"
      ref={sidebarPhotosRef}
      style={{
        marginLeft,
      }}
    >
      {photoSets.map((ps, idx) => (
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

          {/* hacky--uggh--but fill in any blank spots at the end with 'empty cards' to maintain alignment  */}
          {blankCardsCount.map(idx => (
            <div 
              className='blankCard' 
              style={{
                height: blankCardHeight,
                width: blankCardWidth,
              }}
              key={`blankCard${idx}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SidebarPhotos;

SidebarPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
};

SidebarPhotos.defaultProps = {
};

