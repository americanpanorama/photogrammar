import he from 'he';
import A from './actionTypes';
import Photographers from '../../data/photographers.json';
import Counties from '../../data/svgs/counties.json';
import Cities from '../../data/citiesCounts.json';
import { makeWheres } from './selectors';

const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT * FROM photogrammar_photos';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};
const basename = process.env.PUBLIC_URL;

/* 
  action functions
    initializeData
    selectViz
    selectMapView
    selectTheme
    selectNation
    selectState
    selectCounty
    selectCity
    selectPhoto
    selectPhotographer
    clearPhotographer
    setFilterTerms
    clearFilterTerms
    setPhotoOffset
    setTimeRange
    closeWelcome
    toggleExpandedSidebar
    windowResized
    calculateDimensions

  utility functions
    getEventId
    fetchJSON
    fetchCountiesCitiesTheme
    fetchTimelineCells
    getStateNameFromAbbr
*/

export function initializeData() {
  return async (dispatch, getState) => {
    const {
      dimensions,
      countiesData,
      citiesData,
      timelineCells,
      selectedCounty,
      selectedCity,
      selectedState,
      selectedMapView,
      selectedViz,
      selectedTheme,
      isWelcomeOpen,
      expandedSidebar
    } = getState();
    const theDimensions = calculateDimensions({ isWelcomeOpen, expandedSidebar });
    if (!dimensions.calculated) {
      dispatch({
        type: A.DIMENSIONS_CALCULATED,
        payload: theDimensions,
      });
    }
    const { counties, cities, themes } = await fetchJSON(`${basename}/data/photographers/all.json`);
    dispatch({
      type: A.LOAD_COUNTIES_AND_CITIES,
      payload: {
        counties,
        cities,
        themes,
      }
    });
    if (timelineCells.length === 0) {
      dispatch({
        type: A.LOAD_TIMELINE_CELLS,
        payload: {
          timelineCells: await fetchTimelineCells(getState()),
        }
      });
    }
    dispatch({
      type: A.INITIALIZED,
    });
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
    const { selectedMapView } = getState();

    // Roy Strkyer is a singular exception
    const { counties, cities, themes } = await fetchCountiesCitiesThemes(selectedPhotographer);
    dispatch({
      type: A.SELECT_PHOTOGRAPHER,
      payload: {
        photographer: selectedPhotographer,
        counties,
        cities,
        themes,
        sidebarPhotosOffset: 0,
      }
    });
  };
}

export function clearPhotographer() {
  return async (dispatch, getState) => {
    const { selectedMapView } = getState();
    const { counties, cities, themes } = await fetchJSON(`${basename}/data/photographers/all.json`);
    dispatch({
      type: A.CLEAR_PHOTOGRAPHER,
      payload: {
        counties,
        cities,
        themes,
        sidebarPhotosOffset: 0,
      }
    });
  };
}

export function selectCounty(eOrId) {
  return async (dispatch, getState) => {
    const county = getEventId(eOrId);
    const { s: state } = Counties.find(c => c.j === county);
    dispatch({
      type: A.SELECT_COUNTY,
      payload: {
        county,
        state,
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/counties/${county}.json`),
      }
    });
  };
}

export function selectCity(eOrId) {
  return async (dispatch, getState) => {
    const city = getEventId(eOrId);
    dispatch({
      type: A.SELECT_CITY,
      payload: {
        city,
        state: city.substring(0, 2),
        sidebarPhotosOffset: 0,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/cities/${encodeURI(city)}.json`),
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

export function selectTheme(eOrId) {
  return async (dispatch, getState) => {
    const selectedTheme = getEventId(eOrId);
    dispatch({
      type: A.SELECT_THEME,
      payload: {
        theme: selectedTheme,
        timelineCells: await fetchJSON(`${basename}/data/photoCounts/themes/${encodeURI(selectedTheme)}.json`),
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

export function selectViz(eOrId) {
  return {
    type: A.SELECT_VIZ,
    payload: getEventId(eOrId)
  };
}

export function selectPhoto(eOrId) {
  if (!eOrId) {
    return {
      type: A.SELECT_PHOTO,
      payload: null,
    };
  }
  return async (dispatch, getState) => {
    const id = decodeURIComponent(getEventId(eOrId));
    const { selectedPhotoData } = getState();
    if (!selectedPhotoData || selectedPhotoData.loc_item_link !== id) {
      // create the queries to get the photo data and similar photo data
      const query = `${sqlQueryBase} where loc_item_link = '${id}' `;
      const queries = [...Array(14).keys()].map(n => n+1).map(x => {
        return `SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos where loc_item_link = (select nn${x} from similarphotos where source = '${id}')`
      });
      const similarPhotosQuery = queries.join(' union ');

      // retrieve results from carto and organize
      const [photoDataResults, similarPhotosData] = await Promise.all([
        fetchJSON(`${cartoURLBase}${encodeURIComponent(query)}`),
        fetchJSON(`${cartoURLBase}${encodeURIComponent(similarPhotosQuery)}`),
      ]);
      const photoData = photoDataResults.rows[0];
      photoData.caption = (photoData.caption) ? he.decode(photoData.caption) : '';

      photoData.stateAbbr = getStateAbbr(photoData.state);

      photoData.similarPhotos = similarPhotosData.rows.map(sp => ({
        ...sp,
        caption: (sp.cation) ? he.decode(sp.caption) : '',
        stateAbbr: getStateAbbr(photoData.state),
      }));

        console.log(photoData.call_number, photoData.call_number.charAt(-2));
      // if the photo is part of a strip, retrieve those photos
      if (photoData.call_number.charAt(-2) === 'M') {

        const stripQuery = `select loc_item_link, img_thumb_img, photograph_type from photogrammar_photos where call_number = '${photoData.call_number}' order by photograph_type`;
        const responseStripPhotos = await fetchJSON(`${cartoURLBase}${encodeURIComponent(stripQuery)}`);
        if (responseStripPhotos && responseStripPhotos.rows && responseStripPhotos.rows.length > 0) {
          photoData.stripPhotos = responseStripPhotos.rows.map(sp => ({
            ...sp,
            num: parseInt(sp.photograph_type.substring(1)),
          }));
        }
      }
      
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

export function toggleExpandedSidebar() {
  return async (dispatch, getState) => {
    const theDimensions = calculateDimensions({ isWelcomeOpen: false, expandedSidebar: !getState().expandedSidebar });
    dispatch({
      type: A.DIMENSIONS_CALCULATED,
      payload: theDimensions,
    });
    dispatch({
      type: A.TOGGLE_EXPANDED_SIDEBAR,
    });
  }
}

export function toggleViz() {
  return {
    type: A.TOGGLE_VIZ,
  }
}

export function toggleLightbox() {
  return {
    type: A.TOGGLE_LIGHTBOX,
  };
}

export function setTimeRange(tr) {
  return async (dispatch, getState) => {
    // if time range isn't set, reset it to the full view
    const timeRange = (tr && Array.isArray(tr) && tr.length === 2) ? tr : [193501, 194406];
    dispatch({
      type: A.SET_TIME_RANGE,
      payload: timeRange,
    });

    // fetch data if there's a filter selection
    const { filterTerms } = getState();
    if (filterTerms.length > 0) {
      dispatch(setFilterTerms(filterTerms.join(' '), timeRange));
    }
  }
}

export function selectMapView(eOrId) {
  return async (dispatch, getState) => {
    const selectedMapView = getEventId(eOrId);

    dispatch({
      type: A.SELECT_MAP_VIEW,
      payload: selectedMapView,
    });

    dispatch({
      type: A.LOAD_TIMELINE_CELLS,
      payload: {
        timelineCells: await fetchTimelineCells(getState()),
      }
    });
  }
}

export function clearFilterTerms() {
  return async (dispatch, getState) => {
    // fetch the visualization and timecellData
    const [vizData, timelineCells] = await Promise.all([
      fetchCountiesCitiesThemes(getState().selectedPhotographer),
      fetchTimelineCells(getState()),
    ]);
    const { counties, cities, themes } = vizData;
    dispatch({
      type: A.CLEAR_FILTER_TERMS,
      payload: {
        counties,
        cities,
        themes,
        timelineCells,
      }
    });
  };
};

export function setFilterTerms(terms, tr) {
  return async (dispatch, getState) => {
      const {
      selectedPhotographer,
      selectedCounty,
      selectedCity,
      selectedState,
      timeRange: stateTimeRange,
      selectedViz,
      selectedTheme,
      selectedMapView,
    } = getState();
    // use either the user specified time range or state
    const timeRange = tr || stateTimeRange;
    const filterTerms = terms.match(/(".*?"|[^",\s]+)(?=\s*|\s*$)/g) || [];

    let counties;
    let cities;
    let themes = { total: 0, children: {} };
    let timelineCells;

    let wheresForCityQuery = [];
    if (selectedCity) {
      const selectedCityMetadata = Cities.find(cc => cc.key === selectedCity);
      if (selectedCityMetadata) {
        const { state, city, otherPlaces } = selectedCityMetadata;
        wheres.push(`state = '${stateabbrs[state]}'`);
        const cityNames = [city];
        if (otherPlaces) {
          otherPlaces.forEach(op => {
            cityNames.push(op.city);
          });
        }
        wheresForCityQuery = cityNames.map(cityName => `city = '${cityName}'`);
      }
    }

    const wheres = makeWheres(selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, wheresForCityQuery, selectedViz, selectedTheme, selectedMapView, filterTerms);

    if (wheres.length > 0) {
      // build the queries to select the counties, cities, and timelinecells
      const queryCounties = `select nhgis_join, count(img_large_path) as total from photogrammar_photos where nhgis_join is not null and ${wheres.join(' and ')} group by nhgis_join`;
      const queryCities = `select state, city, count(img_large_path) as total from photogrammar_photos where city is not null and ${wheres.join(' and ')} group by state, city`;
      const queryThemes = `select vanderbilt_level1, vanderbilt_level2, vanderbilt_level3, count(img_large_path) as total from photogrammar_photos where vanderbilt_level3 != '' and ${wheres.join(' and ')} group by vanderbilt_level1, vanderbilt_level2, vanderbilt_level3`;
      const photographers_wheres = Photographers
        .filter(p => p.count >= 75)
        .map(p => `photographer_name = '${p.firstname} ${p.lastname}'`);
      const queryTimelineCells = `SELECT year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g') as photographer, count(img_large_path) as count FROM photogrammar_photos where ${wheres.join(' and ')} and (${photographers_wheres.join( 'or ')}) group by year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g')`;
      
            // fetch them
      const [countyResults, cityResults, themesResults, timelineCellResults] = await Promise.all([
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryCounties)}`),
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryCities)}`),
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryThemes)}`),
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryTimelineCells)}`),
      ]);

      // do some data formatting/organization
      const { rows: rowsCounties } = countyResults;
      if (rowsCounties.length > 0) {
        counties = {};
        rowsCounties.forEach(county => {
          counties[county.nhgis_join] = {
            total: county.total,
          };
        });
      }

      const { rows: rowsCities } = cityResults;
      if (rowsCities.length > 0) {
        cities = {};
        rowsCities.forEach(city => {
          const abbrIdx = Object.values(stateabbrs).indexOf(city.state);
          if (abbrIdx !== -1) {
            const abbr = Object.keys(stateabbrs)[abbrIdx];
            cities[`${abbr}_${city.city}`] = {
              total: city.total,
            };
          }
        });
      }

      const { rows: rowsThemes } = themesResults;
      if (rowsThemes.length > 0) {
        
        rowsThemes.forEach(theme => {
          const { vanderbilt_level1: level1, vanderbilt_level2: level2, vanderbilt_level3: level3, total } = theme;
          themes.children[level1] = themes.children[level1] || {
            total: 0,
            children: {},
          };
          themes.children[level1].total += total;
          themes.children[level1].children[level2] = themes.children[level1].children[level2] || {
            total: 0,
            children: {},
          };
          themes.children[level1].children[level2].children[level3] = themes.children[level1].children[level2].children[level3] || {
            total: 0,
          };
          themes.total += total;
          themes.children[level1].total += total;
          themes.children[level1].children[level2].total += total;
          themes.children[level1].children[level2].children[level3].total += total;
        });
      }

      ({ rows: timelineCells } = timelineCellResults);
    }

    dispatch({
      type: A.SET_FILTER_TERMS,
      payload: {
        filterTerms,
        counties,
        cities,
        themes,
        timelineCells,
      }
    });
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
  const { innerHeight: windowInnerHeight, innerWidth: windowInnerWidth } = window;
  const { clientWidth, clientHeight } = (document.documentElement) ? document.documentElement : { clientWidth: null, clientHeight: null };
  const innerWidth = clientWidth || windowInnerWidth;
  const innerHeight = clientHeight || windowInnerHeight; 

  const isMobile = innerWidth <= 768;

  const windowWidth = Math.max(800, innerWidth);

  let welcomeHeight = (options && options.isWelcomeOpen) ? 0 : 0;
  const expandedSidebar = (options && options.expandedSidebar);

  const vizCanvasWidth =  (!expandedSidebar)
    ? Math.min(windowWidth * 0.66, windowWidth - 200) - padding * 2
    : Math.min(windowWidth * 0.33, windowWidth - 200) - padding * 2
  const vizCanvas = {
    height: Math.max(600, innerHeight - headerHeight - timelineSliderHeight),
    width: vizCanvasWidth,
  }

  const selectedPhoto = {
    height: Math.max(600, innerHeight - headerHeight),
  }

  const timelineHeatmap = (isMobile) ? {
    width: innerWidth * 0.8,
    height: Math.min(Photographers.length * 15, vizCanvas.height / 3),
    leftAxisWidth: innerWidth * 0.15,
  } : {
    width: Math.min(vizCanvas.width * 0.75, vizCanvas.width - 200),
    height: Math.min(Photographers.length * 15, vizCanvas.height / 3),
    leftAxisWidth: Math.max(200, vizCanvas.width * 0.25),
  };

  const mapControlsWidth = 50;
  const mapControlsHeight = vizCanvas.height - timelineHeatmap.height - padding / 2;
  const mapControls = {
    width: mapControlsWidth,
    height: mapControlsHeight,
  };

  const mapWidth = (isMobile) ? innerWidth: vizCanvas.width - mapControlsWidth;
  const mapHeight = (isMobile) ? innerHeight * 0.5 - 70 : vizCanvas.height - timelineHeatmap.height - padding / 2;
  const horizontalScale = mapWidth / 960;
  const verticalScale = mapHeight / 500;
  const map = {
    height: mapHeight,
    width: mapWidth,
    scale: Math.min(horizontalScale, verticalScale) / 1000,
  };

  let sidebarWidth = innerWidth;
  if (!isMobile) {
    sidebarWidth = (!expandedSidebar)
      ? Math.max(200, windowWidth * 0.33)
      : Math.max(200, windowWidth * 0.66);
  }
  const sidebarHeight = (!isMobile)
    ? vizCanvas.height - 125 - welcomeHeight
    : innerHeight - 75;
  const sidebarHeaderHeight = 70;
  const filterHeight = 34;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
    headerHeight: sidebarHeaderHeight,
    photosHeight: sidebarHeight - sidebarHeaderHeight - filterHeight,
  }

  // the photocard will be scaled to be between 150 and 200px
  const photoCardMinWidth = (expandedSidebar) ? 250 : 160;
  const photoCardMaxWidth = 300;
  const maxCols = Math.floor(sidebarWidth / photoCardMinWidth);
  let cols = Math.floor(sidebarWidth / photoCardMinWidth);
  let photoCardWidth = sidebarWidth / cols * 0.96;

  // if the maxCols is three or greater, increase the size to make them more visible--shooting for 250 give or take
  for (let potentialCols = cols - 1; potentialCols >= 3 && photoCardWidth < 220; potentialCols -= 1) {
    cols = potentialCols;
    photoCardWidth = sidebarWidth / potentialCols * 0.96
  }
  if (isMobile) {
    photoCardWidth = innerWidth * 0.45;
    cols = 2;
  }
  //const cols = Math.floor(sidebarWidth / photoCardMinWidth);
  //const photoCardWidth = sidebarWidth / cols * 0.96;
  const photoCardScale = photoCardWidth / photoCardMaxWidth;
  const photoCardHeight = 350 * photoCardScale;
  const rows = Math.max(1, Math.floor(sidebarHeight / photoCardHeight));
  //const photoCardWidth = Math.min(200, sidebarWidth / 2);
  const photoCardPaddingMargin = Math.min(5, photoCardWidth * 0.25);
  const photoCardBorderWidth = Math.max(2, photoCardWidth * 0.01);
  const interiorWidth = photoCardWidth - photoCardPaddingMargin * 2 - photoCardBorderWidth * 2;
  const interiorHeight = photoCardHeight - photoCardPaddingMargin * 2 - photoCardBorderWidth * 2;
  //const photoCardHeight = 350;
  //const cols = Math.floor(sidebarWidth / photoCardWidth);
  //const rows = Math.max(1, Math.floor(sidebar.photosHeight / photoCardHeight));
  const photoCards = {
    cols,
    rows,
    displayableCards: cols * rows,
    width: photoCardWidth,
    height: photoCardHeight,
    interiorWidth,
    interiorHeight,
    padding: photoCardPaddingMargin,
    margin: photoCardPaddingMargin,
    borderWidth: photoCardBorderWidth,
    scale: photoCardScale,
  };

  const similarPhotos = {};
  const similarPhotosHeaderHeight = 50;
  similarPhotos.height = Math.min(250, (vizCanvas.height - similarPhotosHeaderHeight) / 3);
  similarPhotos.width = 400;
  similarPhotos.scale = Math.min(1.5, similarPhotos.height / photoCards.height);

  const dimensions = {
    calculated: true,
    vizCanvas,
    map,
    mapControls,
    sidebar,
    photoCards,
    timelineHeatmap,
    selectedPhoto,
    similarPhotos,
    isMobile,
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

async function fetchJSON(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}

async function fetchCountiesCitiesThemes(selectedPhotographer) {
  return (selectedPhotographer)
    ? await fetchJSON(`${basename}/data/photographers/${selectedPhotographer}.json`)
    : await fetchJSON(`${basename}/data/photographers/all.json`);
}

async function fetchTimelineCells(state) {
    const {
      selectedViz,
      selectedMapView,
      selectedCounty,
      selectedCity,
      selectedState,
      selectedTheme,
    } = state;
    let path;
    if (selectedViz === 'map') {
      if (selectedMapView === 'counties') {
        if (selectedCounty) {
          path = `${basename}/data/photoCounts/counties/${selectedCounty}.json`;
        } else if (selectedState) {
          path = `${basename}/data/photoCounts/states/${selectedState}.json`;
        } else {
          path = `${basename}/data/photoCounts/national.json`;
        }
      } else {
        if (selectedCity) {
          path = `${basename}/data/photoCounts/cities/${encodeURI(selectedCity)}.json`;
        } else if (selectedState) {
          path = `${basename}/data/photoCounts/statesCities/${selectedState}.json`;
        } else {
          path = `${basename}/data/photoCounts/nationalCities.json`;
        }
      }
    } else if (selectedViz === 'themes') {
      path = `${basename}/data/photoCounts/themes/${encodeURI(selectedTheme)}.json`;
    }
    if (path) {
      return await fetchJSON(path);
    };
    return [];
}

export function getStateNameFromAbbr (abbr) {
  return stateabbrs[abbr];
}

export const getStateAbbr = (name) => {
  if (!name) {
    return '';
  }
  const stIndex = Object.values(stateabbrs)
    .findIndex(stateName => stateName.toLowerCase() === name.toLowerCase());
  const abbr = Object.keys(stateabbrs)[stIndex];

  return abbr;
};
