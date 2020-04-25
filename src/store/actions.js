import he from 'he';
import A from './actionTypes';
import Photographers from '../../public/data/photographers.json';
import Counties from '../../data/svgs/counties.json';
import Cities from '../../public/data/citiesCounts.json';
import { makeWheres } from './selectors';

const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
const sqlQueryBase = 'SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};
//const basename = '/panorama/photogrammar';
const basename = '';

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
      isWelcomeOpen
    } = getState();
    const theDimensions = calculateDimensions({ isWelcomeOpen });
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
    // if (selectedMapView === 'cities' && citiesData.length === 0) {
    //   dispatch({
    //     type: A.LOAD_CITIES,
    //     payload: {
    //       cities,
    //     }
    //   });
    // }
    if (timelineCells.length === 0) {
      let timelineCells = [];
      if (selectedViz === 'map') {
        if (selectedMapView === 'counties') {
          if (selectedCounty) {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/counties/${selectedCounty}.json`);
          } else if (selectedState) {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/states/${selectedState}.json`);
          } else {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/national.json`);
          }
        } else {
          if (selectedCity) {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/cities/${encodeURI(selectedCity)}.json`)
          } else if (selectedState) {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/statesCities/${selectedState}.json`);
          } else {
            timelineCells = await fetchJSON(`${basename}/data/photoCounts/nationalCities.json`);
          }
        }
      } else if (selectedViz === 'themes') {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/themes/${encodeURI(selectedTheme)}.json`);
      }
      dispatch({
        type: A.LOAD_TIMELINE_CELLS,
        payload: {
          timelineCells,
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
    const { counties, cities, themes } = (selectedPhotographer)
      ? await fetchJSON(`${basename}/data/photographers/${selectedPhotographer}.json`)
      : await fetchJSON(`${basename}/data/photographers/all.json`);
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
    const { selectedPhotographer } = getState();
    console.log(encodeURI(selectedTheme));
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
      photoData.caption = he.decode(photoData.caption);

      photoData.similarPhotos = similarPhotosData.rows.map(sp => ({
        ...sp,
        caption: he.decode(sp.caption),
      }));
      
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

export function setTimeRange(tr) {
  return {
    type: A.SET_TIME_RANGE,
    payload: tr,
  };
}

export function selectMapView(eOrId) {
  return async (dispatch, getState) => {
    const selectedMapView = getEventId(eOrId);
    const { selectedCounty, selectedState } = getState();
    let timelineCells;
    if (selectedCounty) {
      timelineCells = await fetchJSON(`${basename}/data/photoCounts/counties/${selectedCounty}.json`);
    } else if (selectedState) {
      if (selectedMapView === 'counties') {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/states/${selectedState}.json`);
      } else {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/statesCities/${selectedState}.json`);
      }
    } else {
      if (selectedMapView === 'counties') {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/national.json`);
      } else {
        timelineCells = await fetchJSON(`${basename}/data/photoCounts/nationalCities.json`);
      }
    }
    dispatch({
      type: A.LOAD_TIMELINE_CELLS,
      payload: {
        timelineCells,
      }
    });

    dispatch({
      type: A.SELECT_MAP_VIEW,
      payload: selectedMapView,
    });
  }
}

export function setFilterTerms(terms) {
  return async (dispatch, getState) => {
      const {
      selectedPhotographer,
      selectedCounty,
      selectedCity,
      selectedState,
      timeRange,
      selectedViz,
      selectedTheme,
      selectedMapView,
    } = getState();
    const filterTerms = terms.match(/(".*?"|[^",\s]+)(?=\s*|\s*$)/g) || [];

    let counties;
    let cities;
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
      const photographers_wheres = Photographers
        .filter(p => p.count >= 75)
        .map(p => `photographer_name = '${p.firstname} ${p.lastname}'`);
      const queryTimelineCells = `SELECT year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g') as photographer, count(img_large_path) as count FROM photogrammar_photos where ${wheres.join(' and ')} and (${photographers_wheres.join( 'or ')}) group by year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g')`;

      // fetch them
      const [countyResults, cityResults, timelineCellResults] = await Promise.all([
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryCounties)}`),
        fetchJSON(`${cartoURLBase}${encodeURIComponent(queryCities)}`),
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

      ({ rows: timelineCells } = timelineCellResults);
    }

    dispatch({
      type: A.SET_FILTER_TERMS,
      payload: {
        filterTerms,
        counties,
        cities,
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
  const { innerHeight, innerWidth } = window;

  const windowWidth = Math.max(800, innerWidth);

  let welcomeHeight = (options && options.isWelcomeOpen) ? 0 : 0;

  const vizCanvas = {
    height: Math.max(600, innerHeight - headerHeight - padding * 4  - timelineSliderHeight),
    width: Math.min(windowWidth * 0.66, windowWidth - 200) - padding * 2,
  }

  const selectedPhoto = {
    height: Math.max(600, innerHeight - headerHeight),
  }

  const timelineHeatmap = {
    width: vizCanvas.width * 0.85,
    height: Math.min(Photographers.length * 15, vizCanvas.height / 3),
    leftAxisWidth: vizCanvas.width * 0.15,
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

  const sidebarWidth = Math.max(200, windowWidth * 0.33);
  const sidebarHeight = vizCanvas.height - welcomeHeight;
  const sidebarHeaderHeight = 70;
  const sidebar = {
    width: sidebarWidth,
    height: sidebarHeight,
    headerHeight: sidebarHeaderHeight,
    photosHeight: sidebarHeight - sidebarHeaderHeight,
  }

  // the photocard will be scaled to be between 150 and 200px
  const photoCardMinWidth = 160;
  const photoCardMaxWidth = 220;
  const cols = Math.floor(sidebarWidth / photoCardMinWidth);
  const photoCardWidth = sidebarWidth / cols * 0.96;
  const photoCardScale = photoCardWidth / photoCardMaxWidth;
  const photoCardHeight = 350 * photoCardScale;
  const rows = Math.max(1, Math.floor(sidebarHeight / photoCardHeight));
  //const photoCardWidth = Math.min(200, sidebarWidth / 2);
  const photoCardPaddingMargin = Math.min(5, photoCardWidth * 0.25);
  const photoCardBorderWidth = Math.max(3, photoCardWidth * 0.015);
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
    mapProjection,
    mapControls,
    sidebar,
    photoCards,
    timelineHeatmap,
    selectedPhoto,
    similarPhotos,
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
