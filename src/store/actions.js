import he from 'he';
import A from './actionTypes';
import Photographers from '../../data/photographers.json';
import Counties from '../../data/svgs/counties.json';
import Cities from '../../data/citiesCounts.json';
import { makeWheres } from './selectors';

const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT * FROM photogrammar_photos';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};
const basename = process.env.PUBLIC_URL;

/* 
  action functions
    initializeData
    setState
    selectViz
    selectPhoto
    setPhotoOffset
    setTimeRange
    closeWelcome
    toggleExpandedSidebar
    windowResized
    calculateDimensions

  utility functions
    getEventId
    getStateNameFromAbbr
*/

export function initializeData() {
  return async (dispatch, getState) => {
    const {
      isWelcomeOpen,
      expandedSidebar,
      dimensions,
    } = getState();
    const theDimensions = calculateDimensions({ isWelcomeOpen, expandedSidebar });
    if (!dimensions.calculated) {
      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: theDimensions,
      });
    }
    dispatch({
      type: A.INITIALIZED,
    });
  }
}

export function setState(payload) {
  return (dispatch, getState) => {
    // if any selection has changed, reset the photooffset
    const { selectedPhotographer, selectedState, selectedCounty, selectedCity, selectedTheme,
        selectedViz, selectedMapView, filterTerms, timeRange, sidebarPhotosOffset } = getState();

    payload.sidebarPhotosOffset = (payload.selectedPhotographer !== selectedPhotographer
      || payload.selectedState !== selectedState || payload.selectedCounty !== selectedCounty
      || payload.selectedCity !== selectedCity || payload.selectedTheme !== selectedTheme
      || payload.selectedViz !== selectedViz || payload.selectedMapView !== selectedMapView
      || payload.timeRange[0] !== timeRange[0] || payload.timeRange[0] !== timeRange[0]
      || payload.filterTerms.sort().join(',') !== filterTerms.sort().join(','))
      ? 0 : sidebarPhotosOffset;

    dispatch({
      type: A.SET_STATE,
      payload
    });
  }
}

export function setPhotoOffset(eOrId) {
  return {
    type: A.SET_PHOTO_OFFSET,
    payload: getEventId(eOrId, 'number')
  };
}

export function closeWelcome() {
  return (dispatch, getState) => {
    const theDimensions = calculateDimensions({ isWelcomeOpen: false });
    dispatch({
      type: A.DIMENSIONS_CALCULATED,
      payload: theDimensions,
    });
    dispatch({
      type: A.CLOSE_WELCOME
    });
  }
}

export function toggleExpandedSidebar() {
  return async (dispatch, getState) => {
    const theDimensions = calculateDimensions({ isWelcomeOpen: false, expandedSidebar: !getState().expandedSidebar });
    dispatch({
      type: A.DIMENSIONS_CALCULATED,
      payload: theDimensions,
    });
    dispatch({
      type: A.TOGGLE_EXPANDED_SIDEBAR,
    });
  }
}

export function toggleViz() {
  return {
    type: A.TOGGLE_VIZ,
  }
}

export function toggleLightbox() {
  return {
    type: A.TOGGLE_LIGHTBOX,
  };
}

export function toggleSearch() {
  return {
    type: A.TOGGLE_SEARCH,
  };
}

export function setIsLoading(status) {
  return {
    type: A.SET_IS_LOADING,
    payload: status,
  };
}

export function setTimeRange(tr) {
  return async (dispatch, getState) => {
    // if time range isn't set, reset it to the full view
    const timeRange = (tr && Array.isArray(tr) && tr.length === 2) ? tr : [193501, 194406];
    dispatch({
      type: A.SET_TIME_RANGE,
      payload: timeRange,
    });
  }
}

export function windowResized() {
  return (dispatch, getState) => {
    const theDimensions = calculateDimensions({ isWelcomeOpen: getState().isWelcomeOpen });
    dispatch({
      type: A.DIMENSIONS_CALCULATED,
      payload: theDimensions,
    });
  }
}
 
export function calculateDimensions(options) {
  const padding = 10;
  const timelineSliderHeight = 50;
  const headerElements = 101;
  // this should be calculated from the DOM--if it's there
  const headerHeight = (headerElements && headerElements.length >= 1) ? headerElements.height : 101;
  const { innerHeight: windowInnerHeight, innerWidth: windowInnerWidth } = window;
  const { clientWidth, clientHeight } = (document.documentElement) ? document.documentElement : { clientWidth: null, clientHeight: null };
  const innerWidth = clientWidth || windowInnerWidth;
  const innerHeight = clientHeight || windowInnerHeight; 

  const isMobile = innerWidth <= 768;

  const windowWidth = Math.max(800, innerWidth);

  let welcomeHeight = (options && options.isWelcomeOpen) ? 0 : 0;
  const expandedSidebar = (options && options.expandedSidebar);

  const vizCanvasWidth =  (!expandedSidebar)
    ? Math.min(windowWidth * 0.66, windowWidth - 200) - padding * 2
    : Math.min(windowWidth * 0.33, windowWidth - 200) - padding * 2
  const vizCanvas = {
    height: Math.max(600, innerHeight - headerHeight - timelineSliderHeight),
    width: vizCanvasWidth,
  }

  const selectedPhoto = {
    height: Math.max(600, innerHeight - headerHeight),
  }

  const timelineHeatmap = (isMobile) ? {
    width: innerWidth * 0.8,
    height: Math.min(Photographers.length * 15, vizCanvas.height / 3),
    leftAxisWidth: innerWidth * 0.15,
    labelsWidth: 150,
  } : {
    width: Math.min(vizCanvas.width * 0.75, vizCanvas.width - 200),
    height: Math.min(Photographers.length * 15, vizCanvas.height * 0.35),
    leftAxisWidth: Math.max(225, vizCanvas.width * 0.2),
    labelsWidth: 150,
  };

  const mapControlsWidth = 50;
  const mapControlsHeight = vizCanvas.height - timelineHeatmap.height - padding / 2;
  const mapControls = {
    width: mapControlsWidth,
    height: mapControlsHeight,
  };

  const mapWidth = (isMobile) ? innerWidth: vizCanvas.width - mapControlsWidth;
  const mapHeight = (isMobile) ? innerHeight * 0.5 - 70 : vizCanvas.height - timelineHeatmap.height - padding / 2;
  const horizontalScale = mapWidth / 960;
  const verticalScale = mapHeight / 500;
  const map = {
    height: mapHeight,
    width: mapWidth,
    scale: Math.min(horizontalScale, verticalScale) / 1000,
  };

  let sidebarWidth = innerWidth;
  if (!isMobile) {
    sidebarWidth = (!expandedSidebar)
      ? Math.max(200, windowWidth * 0.33)
      : Math.max(200, windowWidth * 0.66);
  }
  const sidebarHeight = (!isMobile)
    ? vizCanvas.height - 75 - welcomeHeight
    : innerHeight - 75;
  const sidebarHeaderHeight = 100;
  const filterHeight = 34;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
    headerHeight: sidebarHeaderHeight,
    photosHeight: sidebarHeight - sidebarHeaderHeight - filterHeight,
  }

  // the photocard will be scaled to be between 150 and 200px
  const photoCardMinWidth = (expandedSidebar) ? 200 : 145;
  const photoCardMaxWidth = 300;
  const maxCols = Math.floor(sidebarWidth / photoCardMinWidth);
  let cols = Math.floor(sidebarWidth / photoCardMinWidth);
  let photoCardWidth = sidebarWidth / cols * 0.96;

  // if the maxCols is three or greater, increase the size to make them more visible--shooting for 250 give or take
  for (let potentialCols = cols - 1; potentialCols >= 3 && photoCardWidth < 220; potentialCols -= 1) {
    cols = potentialCols;
    photoCardWidth = sidebarWidth / potentialCols * 0.96
  }
  if (isMobile) {
    photoCardWidth = innerWidth * 0.45;
    cols = 2;
  }
  //const cols = Math.floor(sidebarWidth / photoCardMinWidth);
  //const photoCardWidth = sidebarWidth / cols * 0.96;
  const photoCardScale = photoCardWidth / photoCardMaxWidth;
  const photoCardHeight = 350 * photoCardScale;
  const rows = Math.max(1, Math.floor(sidebarHeight / photoCardHeight));
  //const photoCardWidth = Math.min(200, sidebarWidth / 2);
  const photoCardPaddingMargin = Math.min(5, photoCardWidth * 0.25);
  const photoCardBorderWidth = Math.max(2, photoCardWidth * 0.01);
  const interiorWidth = photoCardWidth - photoCardPaddingMargin * 2;
  const interiorHeight = photoCardHeight - photoCardPaddingMargin * 2;
  //const photoCardHeight = 350;
  //const cols = Math.floor(sidebarWidth / photoCardWidth);
  //const rows = Math.max(1, Math.floor(sidebar.photosHeight / photoCardHeight));
  const photoCards = {
    cols,
    rows,
    displayableCards: cols * rows,
    width: photoCardWidth,
    height: photoCardHeight,
    interiorWidth,
    interiorHeight,
    padding: photoCardPaddingMargin,
    margin: photoCardPaddingMargin,
    borderWidth: photoCardBorderWidth,
    scale: photoCardScale,
  };

  const similarPhotos = {};
  const similarPhotosHeaderHeight = 50;
  similarPhotos.height = Math.min(250, (vizCanvas.height - similarPhotosHeaderHeight) / 3);
  similarPhotos.width = 400;
  similarPhotos.scale = Math.min(1.5, similarPhotos.height / photoCards.height);

  const dimensions = {
    calculated: true,
    vizCanvas,
    map,
    mapControls,
    sidebar,
    photoCards,
    timelineHeatmap,
    selectedPhoto,
    similarPhotos,
    isMobile,
  }

  return dimensions;
}

function getEventId(eOrId, type = 'string') {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
}

export function getStateNameFromAbbr (abbr) {
  return stateabbrs[abbr];
}

export const getStateAbbr = (name) => {
  if (!name) {
    return '';
  }
  const stIndex = Object.values(stateabbrs)
    .findIndex(stateName => stateName.toLowerCase() === name.toLowerCase());
  const abbr = Object.keys(stateabbrs)[stIndex];

  return abbr;
};

