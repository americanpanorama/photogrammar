import A from './actionTypes';
import Photographers from '../../public/data/photographers.json';
console.log(Photographers);
const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};

export function initializeData() {
  return async (dispatch, getState) => {
    const { dimensions, countiesData} = getState();
    const theDimensions = calculateDimensions();
    if (!dimensions.calculated) {
      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: theDimensions,
      });
    }
    if (countiesData.length === 0) {
      const { counties } = await fetchJSON(`${process.env.PUBLIC_URL}/data/photographers/all.json`);
      dispatch({
        type: A.LOAD_COUNTIES,
        payload: {
          counties,
        }
      });
    }
  }
}

export function selectNation() {
  return async (dispatch, getState) => {
    dispatch({
      type: A.SELECT_NATION,
      payload: {
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/national.json`),
      }
    });
  };
}

export function selectPhotographer(eOrId) {
  return async (dispatch, getState) => {
    const selectedPhotographer = getEventId(eOrId);
    const { counties } = (selectedPhotographer)
      ? await fetchJSON(`${process.env.PUBLIC_URL}/data/photographers/${selectedPhotographer}.json`)
      : await fetchJSON(`${process.env.PUBLIC_URL}/data/photographers/all.json`);
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

export function selectCounty(eOrId) {
  return async (dispatch, getState) => {
    const county = getEventId(eOrId);
    console.log(`${process.env.PUBLIC_URL}/data/photoCounts/counties/${county}.json`);
    dispatch({
      type: A.SELECT_COUNTY,
      payload: {
        county,
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/counties/${county}.json`),
      }
    });
  };
}

async function getTimelineCells(getState) {
  const { selectedCounty, selectedState } = getState();
  let timelineCells = [];
  if (selectedCounty) {
    timelineCells = await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/counties/${selectedCounty}.json`);
  } else if (selectedState) {
    console.log(`${process.env.PUBLIC_URL}/data/photoCounts/states/${selectedState}.json`);
    timelineCells = await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/states/${selectedState}.json`);
  } else {
    timelineCells = await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/national.json`);
  }
  return timelineCells;
}

export function selectState(eOrId) {
  return async (dispatch, getState) => {
    const state = getEventId(eOrId);
    dispatch({
      type: A.SELECT_STATE,
      payload: {
        state,
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${process.env.PUBLIC_URL}/data/photoCounts/states/${state}.json`),
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
      dispatch({
        type: A.SELECT_PHOTO,
        payload: photoData,
      });
    }
  }
}

export function setTimeRange(tr) {
  return {
    type: A.SET_TIME_RANGE,
    payload: tr,
  };
}

export function calculateDimensions() {
  const padding = 10;
  const photographersFilterHeight = 40;
  const timelineSliderHeight = 50;
  const headerElements = document.getElementsByClassName('navbar');
  // this should be calculated from the DOM--if it's there
  const headerHeight = (headerElements && headerElements.length >= 1) ? headerElements.height : 101;
  const { innerHeight, innerWidth } = window;

  const vizCanvas = {
    height: innerHeight - headerHeight - padding * 4  - timelineSliderHeight,
    width: Math.min(innerWidth * 0.66, innerWidth - 200) - padding * 2,
  }

  const timelineHeatmap = {
    width: vizCanvas.width - padding * 2,
    height: Photographers.length * 15,
    leftAxisWidth: 150,
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
  const sidebarHeight = vizCanvas.height;
  const sidebarHeaderHeight = 70;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
    headerHeight: sidebarHeaderHeight,
    photosHeight: sidebarHeight - sidebarHeaderHeight,
  }
  const photoCardWidth = 200;
  const photoCardHeight = 350;
  const cols = Math.floor(sidebarWidth / photoCardWidth);
  const rows = Math.floor(sidebar.photosHeight / photoCardHeight);
  const photoCards = {
    cols,
    rows,
    displayableCards: cols * rows,
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
