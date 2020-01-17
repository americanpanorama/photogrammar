import A from './actionTypes';
import Photographers from '../../public/data/photographers.json';

const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos';

export function initializeData() {
  return async (dispatch, getState) => {
    const { dimensions, countiesData, sidebarPhotos } = getState();
    const randomPhotoNumbers = generateRandomPhotoNumbers();
    dispatch({
      type: A.GENERATE_RANDOM_PHOTO_NUMBERS,
      payload: randomPhotoNumbers,
    });
    const theDimensions = calculateDimensions();
    if (!dimensions.calculated) {
      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: theDimensions,
      });
    }
    if (sidebarPhotos.length === 0) {
      const { displayableCards } = theDimensions.photoCards;
      const query = createSidebarPhotosNationalQuery(randomPhotoNumbers.slice(0, displayableCards)); 
      const { rows: sidebarPhotos } = await fetchJSON(encodeURI(`${cartoURLBase}${query}`));
      dispatch({
        type: A.LOAD_SIDEBAR_PHOTOS,
        payload: {
          sidebarPhotos,
          sidebarPhotosOffset: 0,
        },
      });
    }
    if (countiesData.length === 0) {
      const { counties } = await fetchJSON(`/data/photographers/all.json`);
      dispatch({
        type: A.LOAD_COUNTIES,
        payload: {
          counties,
        }
      });
    }
  }
}

function createSidebarPhotosNationalQuery (offsets) {
  const individualQueries = offsets.map(offset => `(${sqlQueryBase} limit 1 offset ${offset})`);
  return individualQueries.join(' union ');
}

export function generateRandomPhotoNumbers(count = 200) {
  const totalRecords = 176212;
  const randomPhotoNumbers = [];
  while (randomPhotoNumbers.length < count) {
    const rn = Math.floor(Math.random() * totalRecords);
    if (!randomPhotoNumbers.includes(rn)) {
      randomPhotoNumbers.push(rn);
    }
  }
  return randomPhotoNumbers;
}

export function selectPhotographer(eOrId) {
  return async (dispatch, getState) => {
    const selectedPhotographer = getEventId(eOrId);
    const { dimensions } = getState();
    const { displayableCards } = dimensions.photoCards;
    const { counties } = (selectedPhotographer)
      ? await fetchJSON(`/data/photographers/${selectedPhotographer}.json`)
      : await fetchJSON(`/data/photographers/all.json`);
    let sidebarPhotos;
    if (selectedPhotographer) {
      const { firstname, lastname } = Photographers.find(p => p.key === selectedPhotographer);
      const where = `where photographer_name = '${firstname} ${lastname}'`;
      sidebarPhotos = await fetchPhotos(where, displayableCards, 0);
    } else {
      //sidebarPhotos = await fetchJSON(`/data/randomSelections/${new Date().getMonth()}-${new Date().getYear()}.json`);
    }
    dispatch({
      type: A.SELECT_PHOTOGRAPHER,
      payload: {
        photographer: selectedPhotographer,
        counties,
        sidebarPhotos,
        sidebarPhotosOffset: 0,
      }
    });
  };
}

export function selectCounty(eOrId) {
  return async (dispatch, getState) => {
    const selectedCounty = getEventId(eOrId);
    const { dimensions } = getState();
    const { displayableCards } = dimensions.photoCards;
    let sidebarPhotos;
    if (selectedCounty) {
      const where = `where nhgis_join = '${selectedCounty}'`;
      sidebarPhotos = await fetchPhotos(where, displayableCards, 0);
    } else {
      //sidebarPhotos = await fetchJSON(`/data/randomSelections/${new Date().getMonth()}-${new Date().getYear()}.json`);
    }
    dispatch({
      type: A.SELECT_COUNTY,
      payload: {
        county: selectedCounty,
        sidebarPhotos,
        sidebarPhotosOffset: 0,
      }
    });
  }
}

export function loadSidebarPhotos(eOrId) {
  return async(dispatch, getState) => {
    const offset = getEventId(eOrId, 'number');
    const { selectedPhotographer, selectedCounty, dimensions, randomPhotoNumbers } = getState();
    const { displayableCards } = dimensions.photoCards;
    const wheres = [];
    let sidebarPhotos = [];
    if (selectedPhotographer || selectedCounty) {
      if (selectedPhotographer) {
        const { firstname, lastname } = Photographers.find(p => p.key === selectedPhotographer);
        wheres.push(`photographer_name = '${firstname} ${lastname}'`);
      }
      if (selectedCounty) {
        wheres.push(`nhgis_join = '${selectedCounty}'`);
      }
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      sidebarPhotos = await fetchPhotos(where, displayableCards, offset);
    } else {
      // it's national
      const query = createSidebarPhotosNationalQuery(randomPhotoNumbers.slice(offset, displayableCards + offset)); 
      const { rows } = await fetchJSON(encodeURI(`${cartoURLBase}${query}`));
      sidebarPhotos = rows;
    }
    dispatch({
      type: A.LOAD_SIDEBAR_PHOTOS,
      payload: {
        sidebarPhotos: sidebarPhotos,
        sidebarPhotosOffset: offset,
      } 
    });
  }
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

export function calculateDimensions() {
  const padding = 10;
  const photographersFilterHeight = 50;
  const headerElements = document.getElementsByClassName('navbar');
  // this should be calculated from the DOM--if it's there
  const headerHeight = (headerElements && headerElements.length >= 1) ? headerElements.height : 101;
  const { innerHeight, innerWidth } = window;

  const vizCanvas = {
    height: innerHeight - headerHeight - padding * 4 - photographersFilterHeight,
    width: Math.min(innerWidth * 0.66, innerWidth - 200) - padding * 2,
  }

  const mapControlsWidth = 50;
  const mapControlsHeight = vizCanvas.height * 2 / 3 - padding / 2;
  const mapControls = {
    width: mapControlsWidth,
    height: mapControlsHeight,
  };

  const mapWidth = vizCanvas.width - mapControlsWidth;
  const mapHeight = vizCanvas.height * 2 / 3 - padding / 2;
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

  const steamgraphWidth = map.width;
  const steamgraphHeight = vizCanvas.height * 1 / 3 - padding / 2;
  const steamgraph = {
    width: steamgraphWidth,
    height: steamgraphHeight,
  };

  const sidebarWidth = Math.max(200, innerWidth * 0.33);
  const sidebarHeight = vizCanvas.height;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
  }
  const photoCardWidth = 200;
  const photoCardHeight = 350;
  const cols = Math.floor(sidebarWidth / photoCardWidth);
  const rows = Math.floor(sidebarHeight / photoCardHeight);
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
    steamgraph,
    sidebar,
    photoCards,
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

async function fetchPhotos(where, limit = 10, offset = 0) {
    let query = `${sqlQueryBase} ${where} order by year, month limit ${limit} offset ${offset}`;
    const response = await fetch(encodeURI(`${cartoURLBase}${query}`));
    const results = await response.json();
    const { rows } = results;
    return rows;
}
