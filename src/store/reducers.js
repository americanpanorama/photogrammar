import { combineReducers } from 'redux';
import A from './actionTypes';
import initialState from './initialState';

const selectedPhotographer = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER) ? action.payload.photographer : state
);

const countiesData = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTOGRAPHER) ? action.payload.counties : state
);

const selectedCounty = (state = initialState, action) => (
  (action.type === A.SELECT_COUNTY) ? action.payload : state
);

const selectedPhotoData = (state = initialState, action) => (
  (action.type === A.SELECT_PHOTO) ? action.payload : state
);

const sidebarPhotos = (state = initialState, action) => state;

const mapPosition = (state = initialState, action) => (
  (action.type === A.MAP_MOVED) ? action.payload : state
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
  mapPosition,
  dimensions,
});

export default combinedReducer;
