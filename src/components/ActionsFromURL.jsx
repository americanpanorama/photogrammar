import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation, matchPath } from "react-router-dom";

const ActionsFromURL = (props) => {
  const {
    selectedViz,
    selectedMapView,
    selectedState,
    selectedCounty,
    selectedCity,
    selectedTheme,
    selectedPhotoData,
    selectedPhotographer,
    selectViz,
    selectPhoto,
    selectMapView,
    selectTheme,
    selectNation,
    selectState,
    selectCity,
    selectCounty,
    selectPhotographer,
    selectedPhoto,
  } = props;

  const {
    pathname,
    hash,
  } = useLocation();

  // remove the basename from the pathPieces
  const pathPieces = pathname.replace(`${process.env.PUBLIC_URL}`, '').split('/');

  const isRetrievingData = useRef(false);
  
  // determine the view from the url
  const isPhotographersView = matchPath(pathname, {
    path: ['/photographers', '/photographer/:photographerKey']
  }); 
  const isMapsView = matchPath(pathname, {
    path: ['/maps', '/city/:placeId', '/county/:placeId', '/city/:placeId', '/state/:placeId', '/'],
    exact: true,
  }); 
  const isThemesView = matchPath(pathname, {
    path: ['/themes/:themeKey', '/themes'],
    exact: true,
  }); 
  const isPhoto = matchPath(pathname, {
    path: '/photo/:id+',
    exact: false,
  });
  let urlViz;
  if (isPhotographersView) {
    urlViz = 'photographers';
  } else if (isMapsView) {
    urlViz = 'map';
  } else if (isThemesView) {
    urlViz = 'themes';
  }

  // deselect photo if the photodata exists but the view isn't photo
  if (isPhoto) {
    const photoId = (pathPieces.length === 4) ? `${pathPieces[2]}/${pathPieces[3]}` : pathPieces[2];
    if (!selectedPhotoData || selectedPhotoData.loc_item_link !== photoId) {
      selectPhoto(photoId);
    }
  } else if (selectedPhotoData) {
    selectPhoto(null);
  }

  // select the viz if necessary
  if (urlViz && urlViz !== selectedViz) {
    selectViz(urlViz);
  }

  // select the mapview if necessary
  if (urlViz === 'map') {
    let urlMapView = 'counties';
    if (hash === '#mapview=cities' || matchPath(pathname, { path: '/city/:placeId' })) {
      urlMapView = 'cities';
    }
    if (urlMapView !== selectedMapView) {
      selectMapView(urlMapView);
    } 

    // retrieve map data if necessary
    // set selected place from url
    const mapScale = (pathPieces.length > 1
      && ['state', 'county', 'city'].includes(pathPieces[1]))
      ? pathPieces[1] : 'national';


    if (mapScale === 'national') {
      if (!isRetrievingData.current && (selectedState || selectedCounty || selectedCity)) {
        isRetrievingData.current = true;
        selectNation();
      } else {
        isRetrievingData.current = false;
      }
    } else {
      const placeId = pathPieces[2];
      if (mapScale === 'state') {
        if (!isRetrievingData.current && (placeId !== selectedState || selectedCounty || selectedCity)) {
          selectState(placeId);
          isRetrievingData.current = true;
        } else if (placeId === selectedState && isRetrievingData.current) {
          isRetrievingData.current = false;
        }
      }
      if (mapScale === 'city' && selectedMapView === 'cities') {
        if (placeId !== selectedCity && !isRetrievingData.current) {
          selectCity(placeId);
          isRetrievingData.current = true;
        } else if (placeId === selectedCounty && isRetrievingData.current) {
          isRetrievingData.current = false;
        }
      }
      if (mapScale === 'county' && selectedMapView === 'counties') {
        if (placeId !== selectedCounty && !isRetrievingData.current) {
          selectCounty(placeId);
          isRetrievingData.current = true;
        } else if (placeId === selectedCounty && isRetrievingData.current) {
          isRetrievingData.current = false;
        }
      }
    }
  }

  // retrieve themes data if necessary
  if (urlViz === 'themes') {
    const themeKey = pathPieces[2] || 'root';

    if (themeKey !== selectedTheme) {
      selectTheme(themeKey);
    }
  }

  // select photographer if necessary
  if (urlViz === 'photographers') {
    const photographerKey = pathPieces[2];

    if (photographerKey && photographerKey !== selectedPhotographer
      && selectedPhotoData !== 'RoyStryker' && selectedPhotographer !== 'AikenAndWool') {
      selectPhotographer(photographerKey);
    }
  }

  return null;
};

export default ActionsFromURL;

ActionsFromURL.propTypes = {
  selectedViz: PropTypes.string,
};

ActionsFromURL.defaultProps = {
  
};
