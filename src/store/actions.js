import A from './actionTypes';
import Photographers from '../../public/data/photographers.json';

const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};
//const basename = '/panorama/photogrammar';
const basename = '';

export function initializeData() {
  return async (dispatch, getState) => {
    const { dimensions, countiesData, timelineCells, selectedCounty, selectedState, isWelcomeOpen } = getState();
    const theDimensions = calculateDimensions({ isWelcomeOpen });
    if (!dimensions.calculated) {
      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: theDimensions,
      });
    }
    if (countiesData.length === 0) {
      const { counties } = await fetchJSON(`${basename}/data/photographers/all.json`);
      dispatch({
        type: A.LOAD_COUNTIES,
        payload: {
          counties,
        }
      });
    }
    if (timelineCells.length === 0) {
      let timelineCells = [];
      if (selectedCounty) {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/counties/${selectedCounty}.json`);
      } else if (selectedState) {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/states/${selectedState}.json`);
      } else {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/national.json`);
      }
      dispatch({
        type: A.LOAD_TIMELINE_CELLS,
        payload: {
          timelineCells,
        }
      })
    }
  }
}

export function selectNation() {
  return async (dispatch, getState) => {
    dispatch({
      type: A.SELECT_NATION,
      payload: {
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/national.json`),
      }
    });
  };
}

export function selectPhotographer(eOrId) {
  return async (dispatch, getState) => {
    const clickedPhotographer = getEventId(eOrId);
    const selectedPhotographer = (getState().selectedPhotographer !== clickedPhotographer)
      ? clickedPhotographer : null;
    const { counties } = (selectedPhotographer)
      ? await fetchJSON(`${basename}/data/photographers/${selectedPhotographer}.json`)
      : await fetchJSON(`${basename}/data/photographers/all.json`);
    dispatch({
      type: A.SELECT_PHOTOGRAPHER,
      payload: {
        photographer: selectedPhotographer,
        counties,
        sidebarPhotosOffset: 0,
      }
    });
  };
}

export function clearPhotographer() {
  return async (dispatch, getState) => {
    const { counties } = await fetchJSON(`${basename}/data/photographers/all.json`);
    dispatch({
      type: A.CLEAR_PHOTOGRAPHER,
      payload: {
        counties,
        sidebarPhotosOffset: 0,
      }
    });
  };
}

export function selectCounty(eOrId) {
  return async (dispatch, getState) => {
    const county = getEventId(eOrId);
    dispatch({
      type: A.SELECT_COUNTY,
      payload: {
        county,
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/counties/${county}.json`),
      }
    });
  };
}

export function selectState(eOrId) {
  return async (dispatch, getState) => {
    const state = getEventId(eOrId);
    dispatch({
      type: A.SELECT_STATE,
      payload: {
        state,
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/states/${state}.json`),
      }
    });
  }
}

export function setPhotoOffset(eOrId) {
  return {
    type: A.SET_PHOTO_OFFSET,
    payload: getEventId(eOrId, 'number')
  };
}

export function selectPhoto(eOrId) {
  return async (dispatch, getState) => {
    const id = decodeURIComponent(getEventId(eOrId));
    const { selectedPhotoData } = getState();
    if (!selectedPhotoData || selectedPhotoData.loc_item_link !== id) {
      const query = `${sqlQueryBase} where loc_item_link = '${id}' `;
      const { rows } = await fetchJSON(`${cartoURLBase}${encodeURIComponent(query)}`);
      const photoData = rows[0];

      // get the similar photos
      const { loc_item_link } = photoData;
      const queries = [...Array(14).keys()].map(n => n+1).map(x => {
        return `SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos where loc_item_link = (select nn${x} from similarphotos where source = '${loc_item_link}')`
      });
      const similarPhotosQuery = queries.join(' union ');
      const { rows: similarPhotoRows } = await fetchJSON(`${cartoURLBase}${encodeURIComponent(similarPhotosQuery)}`);
      photoData.similarPhotos = similarPhotoRows;
      
      dispatch({
        type: A.SELECT_PHOTO,
        payload: photoData,
      });
    }
  }
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

export function setTimeRange(tr) {
  return {
    type: A.SET_TIME_RANGE,
    payload: tr,
  };
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
  const { innerHeight, innerWidth } = window;

  let welcomeHeight = (options && options.isWelcomeOpen) ? 0 : 0;

  const vizCanvas = {
    height: Math.max(600, innerHeight - headerHeight - padding * 4  - timelineSliderHeight),
    width: Math.min(innerWidth * 0.66, innerWidth - 200) - padding * 2,
  }

  const leftAxisWidth = 120;
  const timelineHeatmap = {
    width: vizCanvas.width,
    height: Math.min(Photographers.length * 15, vizCanvas.height / 3),
    leftAxisWidth,
  };

  const mapControlsWidth = 50;
  const mapControlsHeight = vizCanvas.height - timelineHeatmap.height - padding / 2;
  const mapControls = {
    width: mapControlsWidth,
    height: mapControlsHeight,
  };

  const mapWidth = vizCanvas.width - mapControlsWidth;
  const mapHeight = vizCanvas.height - timelineHeatmap.height - padding / 2;
  const horizontalScale = mapWidth / 960;
  const verticalScale = mapHeight / 500;
  const map = {
    height: mapHeight,
    width: mapWidth,
    scale: Math.min(horizontalScale, verticalScale),
  }

  // calculate the amount of padding either top/bottom or left/right for the map when displayed at zoom 0
  // the ratio of width to height for albers is 960 / 500 or 1.92
  const projWxHRatio = 960 / 500;
  const vpWxHRatio = map.width / map.height;
  let mapProjectionWidth;
  let mapProjectionHeight;
  let mapLRPadding;
  let mapTBPadding;

  // if viewport wider than map so left/right padding
  if (vpWxHRatio > projWxHRatio) {
    mapProjectionWidth = projWxHRatio * map.height;
    mapProjectionHeight = map.height;
    mapLRPadding = (map.width - mapProjectionWidth) / 2;
    mapTBPadding = 0;
  } else if (vpWxHRatio > projWxHRatio) {
    mapProjectionWidth = map.width;
    mapProjectionHeight = map.width / projWxHRatio;
    mapLRPadding = 0;
    mapTBPadding = (map.height / mapProjectionHeight) / 2;
  } else {
    mapProjectionWidth = map.width;
    mapProjectionHeight = map.height;
    mapLRPadding = 0; 
    mapTBPadding = 0;
  }
  const mapProjection = {
    width: mapProjectionWidth,
    height: mapProjectionHeight,
    mapLRPadding,
    mapTBPadding,
  };

  const sidebarWidth = Math.max(200, innerWidth * 0.33);
  const sidebarHeight = vizCanvas.height - welcomeHeight;
  const sidebarHeaderHeight = 70;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
    headerHeight: sidebarHeaderHeight,
    photosHeight: sidebarHeight - sidebarHeaderHeight,
  }
  const photoCardWidth = Math.min(200, sidebarWidth / 2);
  const photoCardPaddingMargin = Math.min(5, photoCardWidth * 0.25);
  const photoCardBorderWidth = Math.max(3, photoCardWidth * 0.015);
  const interiorWidth = photoCardWidth - photoCardPaddingMargin * 4 - photoCardBorderWidth * 2;
  const photoCardHeight = 350;
  const cols = Math.floor(sidebarWidth / photoCardWidth);
  const rows = Math.max(1, Math.floor(sidebar.photosHeight / photoCardHeight));
  const photoCards = {
    cols,
    rows,
    displayableCards: cols * rows,
    width: photoCardWidth,
    interiorWidth,
    padding: photoCardPaddingMargin,
    margin: photoCardPaddingMargin,
    borderWidth: photoCardBorderWidth,
  };

  const dimensions = {
    calculated: true,
    vizCanvas,
    map,
    mapProjection,
    mapControls,
    sidebar,
    photoCards,
    timelineHeatmap,
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

export function setXYZ(x, y, z) {
  return {
    type: A.MAP_MOVED,
    payload: {
      x,
      y,
      z,
    },
  };
}

async function fetchJSON(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}

export function getStateNameFromAbbr (abbr) {
  return stateabbrs[abbr];
}
