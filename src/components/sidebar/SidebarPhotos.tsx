import React, { useState, useRef, useEffect } from 'react';
import { Async, useFetch } from 'react-async';
import * as d3 from 'd3';
// @ts-ignore
import he from 'he';
// @ts-ignore
import us from 'us';
import PhotoCard from './PhotoCard.js';
import './SidebarPhotos.css';
import { PhotoMetadata, StateAbbr } from '../../index.d';
import { Props, AsyncFetch, PhotoSet } from './SidebarPhotos.d';

const formatPhotos = (data: AsyncFetch | PhotoMetadata[], offset: number, displayableCards: number) => {
  const sliceStart = Math.max(0, offset - displayableCards);
  const photosToGet = (offset === 0) ? displayableCards * 2 : displayableCards * 3
  const sliceEnd = sliceStart + photosToGet;
  const fromDBAPI = (data: AsyncFetch | PhotoMetadata[]): data is AsyncFetch => (data as AsyncFetch).rows !== undefined;
  const rows = (fromDBAPI(data)) ? data.rows : data.slice(sliceStart, sliceEnd);
  return rows.map((sp: PhotoMetadata, idx: number) => ({
    ...sp,
    caption: (sp.caption) ? he.decode(sp.caption) : '',
    stateAbbr: us.lookup(sp.state).abbr as StateAbbr,
    idx: (fromDBAPI(data)) ? sp.theoffset + idx : sliceStart + idx,
  }));
};

const SidebarPhotos = (props: Props) => {
  const {
    query,
    sidebarPhotosOffset,
    photoSetId,
    displayableCards,
    sidebarWidth,
    cardDimensions,
  } = props;

  const prevPageRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef<HTMLDivElement>(null);
  const nextPageRef = useRef<HTMLDivElement>(null);

  const currentOffset = useRef(sidebarPhotosOffset);

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
          .style('transform', `translateX(${0}px)`)
          .on('end', () => {
            currentOffset.current = sidebarPhotosOffset;
          });
        nextPage
          .transition()
          .duration(1000)
          .style('transform', `translateX(${sidebarWidth}px)`);
      } 
    }
  })

  const { data, error }: { data: AsyncFetch | PhotoMetadata[]; error: any; } = useFetch(query, { headers: { accept: "application/json" } });
  if (error) return error.message;
  if (data) {
    // calculate the five possible positions
    const getTranslateX = (offsetIdx: number): number => {
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
    const calculateBlankCards = (numCards: number): string[] => new Array(Math.max(0, displayableCards - numCards)).fill('');

    const photos: PhotoMetadata[] = formatPhotos(data, sidebarPhotosOffset, displayableCards);

    if (photos.length === 0) {
      return (<div>no photos available</div>);
    }
    // assign the retrieved photos to the appropriate set and calculate the offset # of the current set
    let prevPhotos: PhotoMetadata[] = [];
    let currentPhotos: PhotoMetadata[] = [];
    let nextPhotos: PhotoMetadata[] = [];
    let currentPhotosIdx = photos[0].idx;
    if (photos.length <= displayableCards) {
      currentPhotos = photos;
    } else if (photos.length <= displayableCards * 2) {
      // there are two possiblities--if the offset is the second set there is a previous and current set but no next set; otherwise there's a current and next but no previous set
      // this will be the last set
      if (sidebarPhotosOffset > currentOffset.current) {
        prevPhotos = photos.slice(0, displayableCards);
        currentPhotos = photos.slice(displayableCards, displayableCards * 2);
        currentPhotosIdx = photos[displayableCards].idx;
      } else {
        currentPhotos = photos.slice(0, displayableCards);
        nextPhotos = photos.slice(displayableCards, displayableCards * 2);
      }
    } else {
      prevPhotos = photos.slice(0, displayableCards);
      currentPhotos = photos.slice(displayableCards, displayableCards * 2);
      nextPhotos = photos.slice(displayableCards * 2);
      currentPhotosIdx = photos[displayableCards].idx;
    }

    const photoSets: PhotoSet[] = [
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
            {ps.photos.map((photo: PhotoMetadata) => (
              <PhotoCard
                photo={photo}
                key={photo.loc_item_link}
              />
            ))}

            {/* fill in any blank spots at the end with 'empty cards' to maintain alignment  */}
            {ps.blankCards.map((blank: string, idx: number) => (
              <div 
                className='blankCard' 
                style={{
                  height: cardDimensions.height,
                  width: cardDimensions.width,
                }}
                key={`blankCard${idx.toString()}`}
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
