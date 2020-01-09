import A from './actionTypes';

export function initializeData() {
  return async (dispatch, getState) => {
    const { dimensions, countiesData } = getState();
    if (!dimensions.calculated) {
      dispatch(calculateDimensions());
    }
    if (countiesData.length === 0) {
      const { counties } = await fetchJSON(`/data/photographers/all.json`);
      dispatch({
        type: A.SELECT_PHOTOGRAPHER,
        payload: {
          photographer: null,
          counties,
        }
      });
    }
  }
}

export function selectPhotographer(eOrId) {
  return async (dispatch, getState) => {
    const selectedPhotographer = getEventId(eOrId);
    const { counties } = (selectedPhotographer)
      ? await fetchJSON(`/data/photographers/${selectedPhotographer}.json`)
      : await fetchJSON(`/data/photographers/all.json`);
    dispatch({
      type: A.SELECT_PHOTOGRAPHER,
      payload: {
        photographer: selectedPhotographer,
        counties,
      }
    });
  };
}

export function selectPhoto(eOrId) {
  return async (dispatch, getState) => {
    const id = getEventId(eOrId);
    const { selectedPhotoData } = getState();
    if (!selectedPhotoData || selectedPhotoData.call_number !== id) {
      console.log(`./data/photos/${id}.json`);
      const photoData = await fetchJSON(`../data/photos/${id}.json`);
      dispatch({
        type: A.SELECT_PHOTO,
        payload: photoData,
      });
    }
  }
}

export function calculateDimensions() {
  return (dispatch, getState) => {
    const { calculated, vizCanvas, map } = getState().dimensions;
    if (!calculated) {
      const padding = 10;
      const photographersFilterHeight = 50;
      const headerElements = document.getElementsByClassName('navbar');
      // this should be calculated from the DOM--if it's there
      const headerHeight = (headerElements && headerElements.length >= 1) ? headerElements.height : 101;
      const { innerHeight, innerWidth } = window;

      const vizCanvas = {
        height: innerHeight - headerHeight - padding * 4 - photographersFilterHeight,
        width: Math.min(innerWidth * 0.6, innerWidth - 200) - padding * 2,
      }

      const mapWidth = vizCanvas.width;
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
        const mapProjectionWidth = map.width;
        const mapProjectionHeight = map.width / projWxHRatio;
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

      const dimensions = {
        calculated: true,
        vizCanvas,
        map,
        mapProjection,
      }

      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: dimensions,
      });
    }
  };
}

function getEventId(eOrId, type = 'string') {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
}

export function setXYZFromBounds(bounds, gutter = 0.9) {
  return (dispatch, getState) => {
    const {
      map,
      mapProjection,
    } = getState().dimensions;

    const center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
    const dx = Math.abs(bounds[1][0] - bounds[0][0]);
    const dy = Math.abs(bounds[1][1] - bounds[0][1]);
    const scale = gutter / Math.max(dx / map.width, dy / map.height);
    const x = map.width / 2 - scale * center[0];
    const y = map.height / 2 - scale * center[1];

    dispatch({
      type: A.MAP_MOVED,
      payload: {
        x,
        y,
        z: scale,
      },
    });
  };
};

async function fetchJSON(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}
