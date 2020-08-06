import React, { useState, useRef, useEffect } from 'react';
import { Async } from 'react-async';
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

const formatPhotos = (data) => {
  return data.rows.map(sp => ({
    ...sp,
    caption: (sp.caption) ? he.decode(sp.caption) : '',
    stateAbbr: getStateAbbr(sp.state),
  }));
};

const SidebarPhotos = (props) => {
  const {
    query,
    getStateAbbr,
    sidebarPhotosOffset,
    photoSetId,
    displayableCards,
    sidebarWidth,
    blankCardWidth,
    blankCardHeight
  } = props;

  const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';

  const sidebarPhotosRef = useRef();

  const newPhotoSet = {
    setId: photoSetId,
    offset: sidebarPhotosOffset,
  };
  const [photoSet, setPhotoSet] = useState(newPhotoSet);
  const [lastQuery, setLastQuery] = useState(query);

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
            setId: photoSetId,
            offset: sidebarPhotosOffset,
          };
          setPhotoSet(newPhotoSet);
          setLastQuery(query);
          photoContainer.style('margin-left', 0);
        });
    } else if (photoSet.setId !== newPhotoSet.setId) {
      setPhotoSet(newPhotoSet);
      setLastQuery(null);
    }
  }));

  let combinedQuery = query;
  //console.log(query);
  if (lastQuery && photoSet.setId === newPhotoSet.setId && Math.abs(newPhotoSet.offset - photoSet.offset) === displayableCards) {
    // create the combined query
    combinedQuery = (newPhotoSet.offset > photoSet.offset) ? `(${lastQuery}) union all (${query})` : `(${query}) union all (${lastQuery})`
    // console.log(query);
    // console.log(lastQuery);
    // console.log(combinedQuery);
  }
  combinedQuery = `${cartoURLBase}${encodeURIComponent(combinedQuery)}`;

  return (
    <Async
      promiseFn={loadPhotos}
      query={query}
      watch={query}
    >
      {({ data, error, isPending }) => {
        //if (isPending) return "Loading..."
        if (error) return `Something went wrong: ${error.message}`
        if (data) {
          const photos = formatPhotos(data, getStateAbbr);
          //console.log(photos);

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
              {photoSets.map((ps, idx) => {
                // const thePhotos = (ps.setId !== photoSet.setId || ps.offset !== photoSet.offset || !photoSet.photos)
                //   ? photos : photoSet.photos;
                return (
                  <div
                    className='photoPage'
                    key={`${ps.setId}-${ps.offset}`}
                    // this is necessary to be hardcoded at least in firefox as the flex spec requires a definitive width
                    // https://stackoverflow.com/questions/27472595/firefox-34-ignoring-max-width-for-flexbox
                    style={{
                      width: sidebarWidth,
                    }}
                  >
                    {photos.map(photo => (
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
                )
              })}
            </div>
          );
        }
      }}
    </Async>
  );

  
};

export default SidebarPhotos;

SidebarPhotos.propTypes = {

};

SidebarPhotos.defaultProps = {
};

