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
  return state;
};

const countiesData = (state = initialState, action) => (
  // (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.CLEAR_PHOTOGRAPHER
  //   || action.type === A.LOAD_COUNTIES_AND_CITIES || action.type === A.LOAD_COUNTIES
  //   || (action.type === A.SET_FILTER_TERMS && action.payload.counties)
  //   || action.type === A.)
  (action.payload && action.payload.counties) ? action.payload.counties : state
);

const citiesData = (state = initialState, action) => (
  // (action.type === A.SELECT_PHOTOGRAPHER || action.type === A.CLEAR_PHOTOGRAPHER
  //   || action.type === A.LOAD_COUNTIES_AND_CITIES || action.type === A.LOAD_CITIES
  //   || (action.type === A.SET_FILTER_TERMS && action.payload.cities))
  (action.payload && action.payload.cities) ? action.payload.cities : state
);

const themesData = (state = initialState, action) => (
  // (action.type === A.LOAD_COUNTIES_AND_CITIES || action.type === A.SELECT_PHOTOGRAPHER
  //   || action.type === A.CLEAR_PHOTOGRAPHER)
  (action.payload && action.payload.themes) ? action.payload.themes : state
);

const timelineCells = (state = initialState, action) => (
  // (action.type === A.SELECT_STATE || action.type === A.SELECT_COUNTY
  //   || action.type === A.SELECT_NATION || action.type === A.LOAD_TIMELINE_CELLS
  //   || action.type === A.SELECT_CITY || action.type === A.SELECT_THEME
  //   || action.type === A.SET_FILTER_TERMS)
  (action.payload && action.payload.timelineCells)  ? action.payload.timelineCells : state
);

const selectedCounty = (state = initialState, action) => {
  if (action.type === A.SELECT_COUNTY) {
    return action.payload.county;
  }
  if (action.type === A.SELECT_CITY || action.type === A.SELECT_STATE
    || action.type === A.SELECT_NATION || action.type === A.SELECT_THEME
    || (action.type === A.SELECT_VIZ && action.payload === 'themes')
    || (action.type === A.SELECT_VIZ && action.payload === 'photographers')) {
    return null;
  }
  return state;
};

const selectedCity = (state = initialState, action) => {
  if (action.type === A.SELECT_CITY) {
    return action.payload.city;
  }
  if (action.type === A.SELECT_STATE || action.type === A.SELECT_NATION
    || action.type === A.SELECT_COUNTY || action.type === A.SELECT_THEME
    || (action.type === A.SELECT_VIZ && action.payload === 'themes')
    || (action.type === A.SELECT_VIZ && action.payload === 'photographers')) {
    return null;
  }
  return state;
};

const selectedState = (state = initialState, action) => {
  if (action.type === A.SELECT_STATE || action.type === A.SELECT_CITY || action.type === A.SELECT_COUNTY) {
    return action.payload.state;
  }
  if (action.type === A.SELECT_NATION || action.type === A.SELECT_THEME
    || (action.type === A.SELECT_VIZ && action.payload === 'themes')
    || (action.type === A.SELECT_VIZ && action.payload === 'photographers')) {
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
  if (action.type === A.SELECT_THEME) {
    return 0;
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
};

const randomPhotoNumbers = (state = initialState, action) => (
  (action.type === A.GENERATE_RANDOM_PHOTO_NUMBERS) ? action.payload : state
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

const selectedMapView = (state = initialState, action) => {
  if (action.type === A.SELECT_MAP_VIEW) {
    return action.payload;
  }
  if (action.type === A.SELECT_CITY) {
    return 'cities';
  } 
  return state;
};

const selectedTheme = (state = initialState, action) => {
  if  (action.type === A.SELECT_THEME) {
    return action.payload.theme;
  }
  if ((action.type === A.SELECT_VIZ && action.payload === 'photographers') || 
    (action.type === A.SELECT_VIZ && action.payload === 'map')) {
    return 'root';
  }
  return state;
};

const selectedViz = (state = initialState, action) => (
  (action.type === A.SELECT_VIZ) ? action.payload : state
);

const filterTerms = (state = initialState, action) => {
  if (action.type === A.SET_FILTER_TERMS) {
    return action.payload.filterTerms;
  }
  if (action.type === A.CLEAR_FILTER_TERMS) {
    return [];
  }
  return state;
};

const expandedSidebar = (state = initialState, action) => (
  (action.type === A.TOGGLE_EXPANDED_SIDEBAR) ? !state : state
);

const lightboxOpen = (state = initialState, action) => (
  (action.type === A.TOGGLE_LIGHTBOX) ? !state : state
);

const vizOpen = (state = initialState, action) => (
  (action.type === A.TOGGLE_VIZ) ? !state : state
);


const combinedReducer = combineReducers({
  selectedPhotographer,
  selectedCounty,
  selectedCity,
  selectedState,
  selectedPhotoData,
  timeRange,
  countiesData,
  citiesData,
  themesData,
  timelineCells,
  sidebarPhotosOffset,
  randomPhotoNumbers,
  dimensions,
  isWelcomeOpen,
  selectedMapView,
  isInitialized,
  selectedTheme,
  selectedViz,
  filterTerms,
  expandedSidebar,
  lightboxOpen,
  vizOpen,
});

export default combinedReducer;
