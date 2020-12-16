import { combineReducers } from 'redux';
import A from './actionTypes';
import initialState from './initialState';

const selectedPhotographer = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedPhotographer : state
);

const selectedPhoto = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedPhoto : state
);

const selectedCounty = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedCounty : state
);

const selectedCity = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedCity : state
);

const selectedState = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedState : state
);

const selectedTheme = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedTheme : state
);

const filterTerms = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.filterTerms : state
);

const selectedViz = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedViz : state
);

const selectedMapView = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.selectedMapView : state
);

const sidebarPhotosOffset = (state = initialState, action) => {
  if (action.type === A.SET_STATE) {
    return action.payload.sidebarPhotosOffset;
  }
  if (action.type === A.LOAD_SIDEBAR_PHOTOS) {
    return action.payload.sidebarPhotosOffset;
  }
  if (action.type === A.SET_PHOTO_OFFSET) {
    return action.payload;
  }
  return state;
};

const timeRange = (state = initialState, action) => {
  if (action.type === A.SET_STATE) {
    return action.payload.timeRange;
  }
  if (action.type === A.SET_TIME_RANGE) {
    return action.payload;
  }
  return state;
};

const pathname = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.pathname : state
);

const hash = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? action.payload.hash : state
);

const dimensions = (state = initialState, action) => (
  (action.type === A.DIMENSIONS_CALCULATED) ? action.payload : state
);

const isWelcomeOpen = (state = initialState, action) => (
  (action.type === A.CLOSE_WELCOME) ? false : state
);

const isInitialized = (state = initialState, action) => (
  (action.type === A.INITIALIZED) ? true : state
);

const hasCompletedFirstLoad = (state = initialState, action) => (
  (action.type === A.SET_STATE) ? true : state
);

const expandedSidebar = (state = initialState, action) => (
  (action.type === A.TOGGLE_EXPANDED_SIDEBAR) ? !state : state
);

const searchOpen = (state = initialState, action) => {
  if (action.type === A.TOGGLE_SEARCH) {
    return !state;
  } 
  if (action.type === A.SET_STATE) {
    return false;
  }
  return state;
};

const vizOpen = (state = initialState, action) => (
  (action.type === A.TOGGLE_VIZ) ? !state : state
);

const combinedReducer = combineReducers({
  selectedPhotographer,
  selectedPhoto,
  selectedCounty,
  selectedCity,
  selectedState,
  timeRange,
  sidebarPhotosOffset,
  pathname,
  hash,
  dimensions,
  isWelcomeOpen,
  selectedMapView,
  isInitialized,
  hasCompletedFirstLoad,
  selectedTheme,
  selectedViz,
  filterTerms,
  expandedSidebar,
  searchOpen,
  vizOpen,
});

export default combinedReducer;
