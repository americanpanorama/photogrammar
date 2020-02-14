import { combineReducers } from 'redux';
import A from './actionTypes';
import initialState from './initialState';

const selectedPhotographer = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER) ? action.payload.photographer : state
);

const countiesData = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.LOAD_COUNTIES)
    ? action.payload.counties : state
);

const timelineCells = (state = initialState, action) => (
  (action.type === A.SELECT_STATE || action.type === A.SELECT_COUNTY
    || action.type === A.SELECT_NATION)
    ? action.payload.timelineCells : state
);

const selectedCounty = (state = initialState, action) => {
  if (action.type === A.SELECT_COUNTY) {
    return action.payload.county;
  }
  if (action.type === A.SELECT_STATE || action.type === A.SELECT_NATION) {
    return null;
  }
  return state
};

const selectedState = (state = initialState, action) => {
  if (action.type === A.SELECT_STATE) {
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
  if (action.type === A.SELECT_PHOTOGRAPHER) {
    return null;
  }
  return state
};

const sidebarPhotosOffset = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.LOAD_SIDEBAR_PHOTOS
    || action.type === A.SELECT_COUNTY || action.type === A.SELECT_STATE
    || action.type === A.SELECT_NATION) {
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

const mapPosition = (state = initialState, action) => (
  (action.type === A.MAP_MOVED) ? action.payload : state
);

const randomPhotoNumbers = (state = initialState, action) => (
  (action.type === A.GENERATE_RANDOM_PHOTO_NUMBERS) ? action.payload : state
);

const dimensions = (state = initialState, action) => (
  (action.type === A.DIMENSIONS_CALCULATED) ? action.payload : state
);



const combinedReducer = combineReducers({
  selectedPhotographer,
  selectedCounty,
  selectedState,
  selectedPhotoData,
  timeRange,
  countiesData,
  timelineCells,
  sidebarPhotosOffset,
  mapPosition,
  randomPhotoNumbers,
  dimensions,
});

export default combinedReducer;
