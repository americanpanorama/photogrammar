import React, { useState, useRef, useEffect } from 'react';
import { Async, useFetch } from 'react-async';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import he from 'he';
import { getStateAbbr } from '../../helpers.js';
import PhotoCard from './PhotoCard.js';
import './SidebarPhotos.css';

const loadPhotos = async ({ query }, { signal }) => {
  const response = await fetch(query, { signal });
  if (!response.ok) { console.warn(`Error retrieving photos: ${response}`); }
  return response.json();
};

const formatPhotos = (data, offset, displayableCards) => {
  const sliceStart = Math.max(0, offset - displayableCards);
  const photosToGet = (offset === 0) ? displayableCards * 2 : displayableCards * 3
  const sliceEnd = sliceStart + photosToGet;
  const fromDBAPI = data.rows;
  const rows = (fromDBAPI) ? data.rows : data.slice(sliceStart, sliceEnd);
  return rows.map((sp, idx) => ({
    ...sp,
    caption: (sp.caption) ? he.decode(sp.caption) : '',
    stateAbbr: getStateAbbr(sp.state),
    idx: (fromDBAPI) ? sp.theoffset + idx : sliceStart + idx,
  }));
};

const SidebarPhotos = (props) => {
  const {
    query,
    sidebarPhotosOffset,
    photoSetId,
    displayableCards,
    sidebarWidth,
    cardDimensions,
  } = props;

  const prevPageRef = useRef();
  const currentPageRef = useRef();
  const nextPageRef = useRef();

  const currentOffset = useRef(props.sidebarPhotosOffset);

  useEffect(() => {
    if (prevPageRef && prevPageRef.current) {
      const prevPage = d3.select(prevPageRef.current);
      const currentPage = d3.select(currentPageRef.current);
      const nextPage = d3.select(nextPageRef.current);

      // run the transition to position the middle photoSet in the viewable area
      if (currentOffset.current !== sidebarPhotosOffset) {
        prevPage
          .transition()
          .duration(1000)
          .style('transform', `translateX(${-1 * sidebarWidth}px)`);
        currentPage
          .transition()
          .duration(1000)
          .style('transform', `translateX(${0}px)`);
        nextPage
          .transition()
          .duration(1000)
          .style('transform', `translateX(${sidebarWidth}px)`)
          .on('end', () => {
            currentOffset.current = sidebarPhotosOffset;
          });
      } 
    }
  })

  const state = useFetch(query, { headers: { accept: "application/json" } });
  if (state.error) return state.error.message;
  if (state.data ) {
    // calculate the five possible positions
    const getTranslateX = (offsetIdx) => {
      const farLeft = sidebarWidth * -2;
      const left = sidebarWidth * -1;
      const center = 0;
      const right = sidebarWidth;
      const farRight = sidebarWidth * 2;

      if (offsetIdx < currentOffset.current) {
        if (Math.abs(offsetIdx - currentOffset.current) === displayableCards) {
          return left;
        }
        return farLeft;
      }
      if (offsetIdx > currentOffset.current) {
        if (Math.abs(offsetIdx - currentOffset.current) === displayableCards) {
          return right;
        }
        return farRight;
      }
      return center;
    }
    const calculateBlankCards = numCards => [...Array(Math.max(0, displayableCards - numCards)).keys()];

    const photos = formatPhotos(state.data, sidebarPhotosOffset, displayableCards);

    if (photos.length === 0) {
      return 'no photos available';
    }
    // assign the retrieved photos to the appropriate set and calculate the offset # of the current set
    let prevPhotos = [];
    let currentPhotos = [];
    let nextPhotos = [];
    let currentPhotosIdx = photos[0].idx;
    if (photos.length <= displayableCards) {
      currentPhotos = photos;
    } else if (photos.length <= displayableCards * 2) {
      currentPhotos = photos.slice(0, displayableCards);
      nextPhotos = photos.slice(displayableCards, displayableCards * 2);
    } else {
      prevPhotos = photos.slice(0, displayableCards);
      currentPhotos = photos.slice(displayableCards, displayableCards * 2);
      nextPhotos = photos.slice(displayableCards * 2);
      currentPhotosIdx = photos[displayableCards].idx;
    }

    const photoSets = [
      {
        photos: prevPhotos,
        blankCards: calculateBlankCards(prevPhotos.length),
        translateX: getTranslateX(currentPhotosIdx - displayableCards),
        offset: currentPhotosIdx - displayableCards, 
        ref: prevPageRef,
      },
      {
        photos: currentPhotos,
        blankCards: calculateBlankCards(currentPhotos.length),
        translateX: getTranslateX(currentPhotosIdx),
        offset: currentPhotosIdx, 
        ref: currentPageRef,
      },
      {
        photos: nextPhotos,
        blankCards: calculateBlankCards(nextPhotos.length),
        translateX: getTranslateX(currentPhotosIdx + displayableCards),
        offset: currentPhotosIdx + displayableCards, 
        ref: nextPageRef,
      },
    ];

    return (
      <div id="sidebar-photos">
        {photoSets.map((ps) => (
          <div
            className='photoPage'
            // this is necessary to be hardcoded at least in firefox as the flex spec requires a definitive width
            // https://stackoverflow.com/questions/27472595/firefox-34-ignoring-max-width-for-flexbox
            style={{
              width: sidebarWidth,
              transform: `translateX(${ps.translateX}px)`,
            }}
            ref={ps.ref}
            key={`${photoSetId}-${ps.offset}`}
          >
            {ps.photos.map(photo => (
              <PhotoCard
                photo={photo}
                key={photo.loc_item_link}
              />
            ))}

            {/* fill in any blank spots at the end with 'empty cards' to maintain alignment  */}
            {ps.blankCards.map(idx => (
              <div 
                className='blankCard' 
                style={{
                  height: cardDimensions.height,
                  width: cardDimensions.width,
                }}
                key={`blankCard${idx}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SidebarPhotos;

SidebarPhotos.propTypes = {

};

SidebarPhotos.defaultProps = {
};

