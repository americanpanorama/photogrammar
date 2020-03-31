import { combineReducers } from 'redux';
import A from './actionTypes';
import initialState from './initialState';

const selectedPhotographer = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTOGRAPHER) {
    return action.payload.photographer;
  }  
  if (action.type === A.CLEAR_PHOTOGRAPHER) {
    return null;
  }
  return state
};

const countiesData = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.CLEAR_PHOTOGRAPHER
    || action.type === A.LOAD_COUNTIES)
    ? action.payload.counties : state
);

const citiesData = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.CLEAR_PHOTOGRAPHER
    || action.type === A.LOAD_CITIES)
    ? action.payload.cities : state
);

const timelineCells = (state = initialState, action) => (
  (action.type === A.SELECT_STATE || action.type === A.SELECT_COUNTY
    || action.type === A.SELECT_NATION || action.type === A.LOAD_TIMELINE_CELLS
    || action.type === A.SELECT_CITY)
    ? action.payload.timelineCells : state
);

const selectedCounty = (state = initialState, action) => {
  if (action.type === A.SELECT_COUNTY) {
    return action.payload.county;
  }
  if (action.type === A.SELECT_CITY || action.type === A.SELECT_STATE || action.type === A.SELECT_NATION) {
    return null;
  }
  return state;
};

const selectedCity = (state = initialState, action) => {
  if (action.type === A.SELECT_CITY) {
    return action.payload.city;
  }
  if (action.type === A.SELECT_STATE || action.type === A.SELECT_NATION || action.type === A.SELECT_COUNTY) {
    return null;
  }
  return state;
};

const selectedState = (state = initialState, action) => {
  if (action.type === A.SELECT_STATE || action.type === A.SELECT_CITY) {
    return action.payload.state;
  }
  if (action.type === A.SELECT_NATION) {
    return null;
  }
  return state;
};

const selectedPhotoData = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTO) {
    return action.payload;
  }
  if (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.SELECT_COUNTY || action.type === A.SELECT_STATE || action.type === A.SELECT_NATION) {
    return null;
  }
  return state;
};

const sidebarPhotosOffset = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.LOAD_SIDEBAR_PHOTOS
    || action.type === A.SELECT_COUNTY || action.type === A.SELECT_STATE
    || action.type === A.SELECT_NATION || action.type === A.CLEAR_PHOTOGRAPHER) {
    return action.payload.sidebarPhotosOffset;
  }
  if (action.type === A.SET_PHOTO_OFFSET) {
    return action.payload;
  }
  return state;
};

const timeRange = (state = initialState, action) => {
  if (action.type === A.SET_TIME_RANGE) {
    return action.payload;
  }
  return state;
}

const randomPhotoNumbers = (state = initialState, action) => (
  (action.type === A.GENERATE_RANDOM_PHOTO_NUMBERS) ? action.payload : state
);

const dimensions = (state = initialState, action) => (
  (action.type === A.DIMENSIONS_CALCULATED) ? action.payload : state
);

const isWelcomeOpen = (state = initialState, action) => (
  (action.type === A.CLOSE_WELCOME) ? false : state
);

const selectedMapView = (state = initialState, action) => {
  if (action.type === A.SELECT_MAP_VIEW) {
    return action.payload;
  }
  if (action.type === A.SELECT_CITY) {
    return 'cities';
  } 
  return state;
};

const combinedReducer = combineReducers({
  selectedPhotographer,
  selectedCounty,
  selectedCity,
  selectedState,
  selectedPhotoData,
  timeRange,
  countiesData,
  citiesData,
  timelineCells,
  sidebarPhotosOffset,
  randomPhotoNumbers,
  dimensions,
  isWelcomeOpen,
  selectedMapView,
});

export default combinedReducer;
