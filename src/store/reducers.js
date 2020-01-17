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

const selectedCounty = (state = initialState, action) => (
  (action.type === A.SELECT_COUNTY) ? action.payload.county : state
);

const selectedPhotoData = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTO) {
    return action.payload;
  }
  if (action.type === A.SELECT_PHOTOGRAPHER) {
    return null;
  }
  return state
};

const sidebarPhotos = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.LOAD_SIDEBAR_PHOTOS || action.type === A.SELECT_COUNTY) {
    return action.payload.sidebarPhotos;
  }
  return state;
};

const sidebarPhotosOffset = (state = initialState, action) => {
  if (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.LOAD_SIDEBAR_PHOTOS || action.type === A.SELECT_COUNTY) {
    return action.payload.sidebarPhotosOffset;
  }
  return state;
};

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
  selectedPhotoData,
  countiesData,
  sidebarPhotos,
  sidebarPhotosOffset,
  mapPosition,
  randomPhotoNumbers,
  dimensions,
});

export default combinedReducer;
