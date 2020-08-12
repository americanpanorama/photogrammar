import { createSelector } from 'reselect';
import * as d3 from 'd3';
import A from './actionTypes';
import { getStateAbbr } from '../helpers.js';
import Counties from '../../data/svgs/counties.json';
import Photographers from '../../data/photographers.json';
import PhotographersMetadata from '../../data/photographersMetadata.json';
import StateCounts from '../../data/stateCounts.json';
import Cities from '../../data/citiesCounts.json';
import Centroids from '../../data/centroids.json';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};
const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    
const getSelectedPhotographer = state => state.selectedPhotographer;
const getSelectedPhoto = state => state.selectedPhoto;
const getSelectedCounty = state => state.selectedCounty;
const getSelectedCity = state => state.selectedCity;
const getSelectedState = state => state.selectedState;
const getSelectedTheme = state => state.selectedTheme;
const getSelectedMapView = state => state.selectedMapView;
const getSelectedViz = state => state.selectedViz;
const getCountiesData = state => state.countiesData;
const getCitiesData = state => state.citiesData;
const getThemesData = state => state.themesData;
const getTimeRange = state => state.timeRange;
const getSidebarPhotosOffset = state => state.sidebarPhotosOffset;
const getDimensions = state => state.dimensions;
const getRandomPhotoNumbers = state => state.randomPhotoNumbers;
const getMapDimensions = state => state.dimensions.map;
const getTimelineCells = state => state.timelineCells;
const getFilterTerms = state => state.filterTerms;
const getPathname = state => state.pathname;
const getHash = state => state.hash;
const getHasCompletedFirstLoad = state => state.hasCompletedFirstLoad; 

const getCartoURLBase = () => cartoURLBase;

export const getPhotographers = (min = 0, max = 50000) => (
  Photographers.filter(p => p.count >= min && p.count <= max)
);

export const getFeaturedPhotographers = () => (
  PhotographersMetadata.map(pm => {
    const basicData = Photographers.find(p => p.key === pm.key);
    return (basicData) ? { ...pm, ...basicData} : pm; 
  })
)

export const getCentroidForCounty = (nhgis_join) => Centroids.counties[nhgis_join];

export const getSelectedPhotographerMetadata = createSelector(
  [getSelectedPhotographer],
  (selectedPhotographer) => {
    const photographer =  Photographers.find(p => p.key === selectedPhotographer)
    if (photographer) {
      const additionalMetadata = PhotographersMetadata.find(pm => photographer.key === pm.key);
      if (additionalMetadata) {
        return ({
          ...photographer,
          ...additionalMetadata,
        });
      }
      return photographer;
    }
    return null;
  }
);

export const getSelectedPhotographerName = createSelector(
  [getSelectedPhotographerMetadata],
  (md) => (md && md.firstname && md.lastname) ? `${md.firstname} ${md.lastname}` : null
);

// this takes the selected time range and returns the actual time range of the returned photos based on the other criteria
// export const getTimeRange = createSelector(
//   [getSelectedTimeRange, getSelectedPhotographerMetadata],
//   (selectedTimeRange, selectedPhotographerMetadata) => {
//     const firstDates = [];
//     const lastDates = [];
//     if (selectedPhotographerMetadata) {
//       firstDates.push(selectedPhotographerMetadata.firstDate);
//       lastDates.push(selectedPhotographerMetadata.lastDate);
//     }
//     return [
//       (firstDates.length > 0) ? Math.min(...firstDates) : selectedTimeRange[0],
//       (lastDates.length > 0) ?  Math.max(...lastDates) : selectedTimeRange[1]
//     ];
//   }
// );

export const getSelectedCountyMetadata = createSelector(
  [getSelectedCounty, getCountiesData],
  (selectedCounty, countiesData) => {
    const county = Counties.find(c => c.j === selectedCounty);
    if (county) {
      return {
        state_terr: county.s,
        name: county.n,
        photoCount: county.c,
        area_sqmi: county.a,
        nhgis_join: county.j,
      };
    }
    return null;
  }
);

export const getSelectedCityMetadata = createSelector(
  [getSelectedCity],
  (selectedCity) => {
    if (selectedCity) {
      const city = Cities.find(cc => cc.key === selectedCity);
      // get the centroid
      if (city) {
        city.center = Centroids.cities[selectedCity] || []
      }
      return city;
    }
    return null;
  }
);

export const getSelectedCountyPhotographers = createSelector(
  [getSelectedCounty, getCountiesData],
  (selectedCounty, countiesData) => {
    const county = counties.features.find(c => c.properties.nhgis_join === selectedCounty);
    if (county && county.properties && county.properties.nhgis_join
      && countiesData[county.properties.nhgis_join]
      && countiesData[county.properties.nhgis_join].photographers) {
      const photographers = Object
        .keys(countiesData[county.properties.nhgis_join].photographers)
        .map(k => {
          let name = 'unspecified';
          const photoCount = countiesData[county.properties.nhgis_join].photographers[k];
          const photographer = Photographers.find(p => p.key === k);
          if (photographer) {
            const { firstname, lastname } = photographer;
            name = `${firstname} ${lastname}`;
          }
          return {
            name,
            photoCount,
            key: k,
          }
        })
        .sort((a, b) => {
          if (a.name === 'unspecified') {
            return 1;
          }
          if (b.name === 'unspecified') {
            return -1;
          }
          if (a.photoCount !== b.photoCount) {
            return b.photoCount - a.photoCount;
          } else if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      return photographers
    }
    return null;
  }
);

export const getSelectedStateName = createSelector(
  [getSelectedState],
  (selectedState) => stateabbrs[selectedState]
);

export const getSelectedStatePhotoCount = createSelector(
  [getSelectedState],
  (selectedState) => StateCounts[selectedState].photoCount
);

export const getSelectedStatePhotographers = createSelector(
  [getSelectedState],
  (selectedState) => {
    const photographers = Object
    .keys(StateCounts[selectedState].photographers)
    .map(k => {
          let name = 'unspecified';
          const photoCount = StateCounts[selectedState].photographers[k];
          const photographer = Photographers.find(p => p.key === k);
          if (photographer) {
            const { firstname, lastname } = photographer;
            name = `${firstname} ${lastname}`;
          }
          return {
            name,
            photoCount,
            key: k,
          }
        })
        .sort((a, b) => {
          if (a.name === 'unspecified') {
            return 1;
          }
          if (b.name === 'unspecified') {
            return -1;
          }
          if (a.photoCount !== b.photoCount) {
            return b.photoCount - a.photoCount;
          } else if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
      return photographers
    }
);

export const getWheresForCityQuery = createSelector(
  [getSelectedCityMetadata],
  (selectedCityMetadata) => {
    if (!selectedCityMetadata) {
      return [];
    }

    const { state, city, otherPlaces } = selectedCityMetadata;
    const wheres = [(`state = '${stateabbrs[state]}'`)];
    const cityNames = [city];
    if (otherPlaces) {
      otherPlaces.forEach(op => {
        cityNames.push(op.city);
      });
    }
    const cityWheres = cityNames.map(cityName => `city = '${cityName}'`);
    wheres.push(`(${cityWheres.join(' or ')})`);
    return wheres;
  }
);

export const makeWheres = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getWheresForCityQuery, getSelectedViz, getSelectedTheme, getSelectedMapView, getFilterTerms],
  (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, wheresForCityQuery, selectedViz, selectedTheme, selectedMapView, filterTerms) => {
    // RoyStryker is an exeption
    if (selectedPhotographer === 'RoyStryker' || selectedPhotographer === 'AikenAndWool') {
      return [];
    }
    
    let wheres = [];
    const [startTime, endTime] = timeRange;
    if (selectedPhotographer || selectedCounty || selectedState || startTime > 193501
        || endTime < 194504 || (selectedTheme && selectedTheme !== 'root')
        || (filterTerms && filterTerms.length > 0)) {
      if (selectedPhotographer) {
        const photographer = Photographers.find(p => p.key === selectedPhotographer);
        let name;
        if (photographer) {
          const { firstname, lastname } = photographer;
          name = `${firstname} ${lastname}`;
        }
        wheres.push(`photographer_name = '${name}'`);
      }
      if (selectedMapView === 'cities' && !selectedCity) {
        wheres.push('city is not null');
        wheres.push('city != \'\'');
      }
      if (selectedCounty) {
        wheres.push(`nhgis_join = '${selectedCounty}'`);
      } else if (selectedCity) {
        wheres = wheres.concat(wheresForCityQuery);
      } else if (selectedState) {
        wheres.push(`state = '${stateabbrs[selectedState]}'`)
      }

      if (selectedTheme && selectedTheme !== 'root') {
        const themesPaths = selectedTheme.split('|').slice(1);
        if (themesPaths.length >= 1) {
          wheres.push(`vanderbilt_level1 = '${themesPaths[0]}'`);
        } 
        if (themesPaths.length >= 2) {
          wheres.push(`vanderbilt_level2 = '${themesPaths[1]}'`);
        } 
        if (themesPaths.length === 3) {
          wheres.push(`vanderbilt_level3 = '${themesPaths[2]}'`);
        }
      }

      if (startTime > 193501) {
        const startYear = Math.floor(startTime / 100);
        const startMonth = startTime % 100;
        wheres.push(`(year > ${startYear} or (year = ${startYear} and month >= ${startMonth}))`);
      }
      if (endTime < 194504) {
        const endYear = Math.floor(endTime / 100);
        const endMonth = endTime % 100;
        wheres.push(`(year < ${endYear} or (year = ${endYear} and month <= ${endMonth}))`);
      }

      if (filterTerms && filterTerms.length > 0) {
        filterTerms.forEach(filterTerm => {
           wheres.push(`caption ~* '\\m${filterTerm}'`);
        });
      }
    }
    return wheres;
  }
);

export const getMapFetchPath = createSelector(
  [getSelectedPhotographer, getSelectedTheme, getSelectedMapView, getFilterTerms, makeWheres],
  (selectedPhotographer, selectedTheme, selectedMapView, filterTerms, wheres) => {
    if (filterTerms.length === 0 && selectedTheme === 'root') {
      return (selectedPhotographer)
        ? `${process.env.PUBLIC_URL}/data/photographers/${selectedPhotographer}.json`
        : `${process.env.PUBLIC_URL}/data/photographers/all.json`;
    }
    return (selectedMapView === 'counties')
      ? `${cartoURLBase}${encodeURIComponent(`select nhgis_join, count(img_large_path) as total from photogrammar_photos where nhgis_join is not null and ${wheres.join(' and ')} group by nhgis_join`)}`
      : `${cartoURLBase}${encodeURIComponent(`select state, city, count(img_large_path) as total from photogrammar_photos where city is not null and ${wheres.join(' and ')} group by state, city`)}`;
  }
);

export const getThemesFetchPath = createSelector(
  [getSelectedPhotographer, getSelectedState, getSelectedMapView, getFilterTerms, makeWheres],
  (selectedPhotographer, selectedState, selectedMapView, filterTerms, wheres) => {
    if (filterTerms.length === 0 && !selectedState) {
      return (selectedPhotographer)
        ? `${process.env.PUBLIC_URL}/data/photographers/${selectedPhotographer}.json`
        : `${process.env.PUBLIC_URL}/data/photographers/all.json`;
    }
    return `${cartoURLBase}${encodeURIComponent(`select vanderbilt_level1, vanderbilt_level2, vanderbilt_level3, count(img_large_path) as total from photogrammar_photos where vanderbilt_level1 is not null and ${wheres.join(' and ')} group by vanderbilt_level1, vanderbilt_level2, vanderbilt_level3`)}`;
  }
);

export const getThemesBackgroundPhotosQuery = createSelector(
  [getSelectedTheme, makeWheres],
  (selectedTheme, wheres) => {
    // filter the where removing level3 if necessary--if the bottom of the tree is selected you still need the background images for the penultimate level, i.e. 2
    const filteredWheres = wheres.filter(w => !w.includes('vanderbilt_level3'));
    const themesPaths = selectedTheme.split('|').slice(1);
    const topLevel = Math.min(themesPaths.length + 1, 3);
    return `${cartoURLBase}${encodeURIComponent(`SELECT pp.vanderbilt_level${topLevel} as theme, (SELECT p.img_medium_path FROM photogrammar_photos as p where img_medium_path is not null and ${filteredWheres.join(' and ')} and pp.vanderbilt_level${topLevel} = p.vanderbilt_level${topLevel} order by random() limit 1) as img FROM photogrammar_photos as pp where ${filteredWheres.join(' and ')} group by vanderbilt_level${topLevel}`)}`;
  }
);

export const getTimelineCellsFetchPath = createSelector(
  [getSelectedViz, getSelectedMapView, getSelectedCounty, getSelectedCity, getSelectedState, getSelectedTheme, getFilterTerms, makeWheres],
  (selectedViz, selectedMapView, selectedCounty, selectedCity, selectedState, selectedTheme, filterTerms, wheres) => {
    if (filterTerms.length === 0) {
      let path;
      if (selectedViz === 'map') {
        if (selectedMapView === 'counties') {
          if (selectedCounty) {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/counties/${selectedCounty}.json`;
          } else if (selectedState) {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/states/${selectedState}.json`;
          } else {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/national.json`;
          }
        } else {
          if (selectedCity) {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/cities/${encodeURI(selectedCity)}.json`;
          } else if (selectedState) {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/statesCities/${selectedState}.json`;
          } else {
            path = `${process.env.PUBLIC_URL}/data/photoCounts/nationalCities.json`;
          }
        }
      } else if (selectedViz === 'themes') {
        path = `${process.env.PUBLIC_URL}/data/photoCounts/themes/${encodeURI(selectedTheme || 'root')}.json`;
      }
      return path;
    }
    // build the queries to select the counties, cities, and timelinecells
    const photographers_wheres = Photographers
      .filter(p => p.count >= 75)
      .map(p => `photographer_name = '${p.firstname} ${p.lastname}'`);
    return `${cartoURLBase}${encodeURIComponent(`SELECT year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g') as photographer, count(img_large_path) as count FROM photogrammar_photos where ${wheres.join(' and ')} and (${photographers_wheres.join( 'or ')}) group by year, month, regexp_replace(photographer_name, '[\\s\\.]', '', 'g')`)}`;
  }
);

export const getSidebarPhotosWheres = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getWheresForCityQuery, getSelectedViz, getSelectedTheme, getSelectedMapView, getFilterTerms],
  makeWheres,
);

export const getSidebarPhotosQuery = createSelector(
  [getSidebarPhotosOffset, getDimensions, getRandomPhotoNumbers, makeWheres],
  (offset, dimensions, randomPhotoNumbers, wheres) => {
    let query;
    const { displayableCards } = dimensions.photoCards;
    const offsetForQuery = Math.max(0, offset - displayableCards);
    const limit = (offset === 0) ? displayableCards * 2 : displayableCards * 3;
    const sqlQueryBase = `SELECT loc_item_link, photographer_name, caption, year, month, vanderbilt_level1, vanderbilt_level2, vanderbilt_level3, city, county, state, img_thumb_img, ${offsetForQuery} as theoffset FROM photogrammar_photos`;
    if (wheres.length > 1) {
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      query = `${sqlQueryBase} ${where} order by year, month, loc_item_link limit ${limit} offset ${offsetForQuery}`;
      return encodeURI(`${cartoURLBase}${query}`);
    } else {
      // it's national
      const date = new Date().getDate();
      return `${process.env.PUBLIC_URL}/data/randomPhotos/${date}.json`;
      query = randomPhotoNumbers
        .slice(offsetForQuery, limit + offsetForQuery)
        .map(offset => `(${sqlQueryBase} limit 1 offset ${offset})`)
        .join(' union all ');
    }
    
  }
);

export const getSidebarPhotoCountQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getSelectedMapView, makeWheres],
  (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, selectedMapView, wheres) => {
    let query;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT count(cartodb_id), min(year * 100 + month) as minDate, max(year * 100 + month) as maxDate FROM photogrammar_photos';
    if (wheres.length > 1) {
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      query = `${sqlQueryBase} ${where}`;
      return `${cartoURLBase}${encodeURIComponent(query)}`;
    } 
    return null;
  }
);

export const getPhotographersCountQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getSidebarPhotosOffset, getDimensions, getRandomPhotoNumbers, getSelectedMapView, getWheresForCityQuery],
  (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, offset, dimensions, randomPhotoNumbers, selectedMapView, wheresForCityQuery) => {
    let query;
    const { displayableCards } = dimensions.photoCards;
    const [startTime, endTime] = timeRange;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT photographer_name, count(photographer_name) FROM photogrammar_photos';
    let wheres = [];
    if (selectedPhotographer || selectedCounty || selectedState || startTime > 193501 || endTime < 194504) {
      if (selectedPhotographer) {
        const photographer = Photographers.find(p => p.key === selectedPhotographer);
        let name;
        if (photographer) {
          const { firstname, lastname } = photographer;
          name = `${firstname} ${lastname}`;
        }
        wheres.push(`photographer_name = '${name}'`);
      }
      if (selectedCounty) {
        wheres.push(`nhgis_join = '${selectedCounty}'`);
      } else if (selectedCity) {
        wheres = wheres.concat(wheresForCityQuery);
      } else if (selectedState) {
        wheres.push(`state = '${stateabbrs[selectedState]}'`)
      }

      if (startTime > 193501) {
        const startYear = Math.floor(startTime / 100);
        const startMonth = startTime % 100;
        wheres.push(`(year > ${startYear} or (year = ${startYear} and month >= ${startMonth}))`);
      }
      if (endTime < 194504) {
        const endYear = Math.floor(endTime / 100);
        const endMonth = endTime % 100;
        wheres.push(`(year < ${endYear} or (year = ${endYear} and month <= ${endMonth}))`);
      }
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      query = `${sqlQueryBase} ${where} group by photographer_name order by case when photographer_name is null then 1 else 0 end, count(photographer_name) desc`;
    } else {
      // it's national
      query = randomPhotoNumbers
        .slice(offset, displayableCards + offset)
        .map(offset => `(${sqlQueryBase} limit 1 offset ${offset})`)
        .join(' union ');
      //query = `${sqlQueryBase} TABLESAMPLE BERNOULLI (100 * 60 / 176212.0) limit ${displayableCards}`;
    }
    return encodeURI(`${cartoURLBase}${query}`);
  }
);

export const getDateRangeString = createSelector(
  [getTimeRange],
  (timeRange) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yearMonths = timeRange.map(tr => ({
      year: Math.floor(tr / 100),
      month: tr % 100,
    }));
    const startString = `${monthNames[yearMonths[0].month - 1].substring(0, 3)} ${yearMonths[0].year}`;
    const endString = `${monthNames[yearMonths[1].month - 1].substring(0, 3)} ${yearMonths[1].year}`;
    return `${startString} - ${endString}`;
  }
);

export const getVizLink = createSelector(
  [getSelectedCounty, getSelectedState, getSelectedViz, getSelectedTheme],
  (selectedCounty, selectedState, selectedViz, selectedTheme) => {
    console.log(selectedViz);
    if (selectedViz === 'themes') {
      return `themes/${selectedTheme}`;
    }
    if (selectedCounty) {
      return `county/${selectedCounty}`;
    }
    if (selectedState) {
      return `state/${selectedState}`;
    }
    return 'maps';
  }
)

export const getMapParameters = createSelector(
  [getMapDimensions, getSelectedCounty, getSelectedCity, getSelectedState],
  (mapDimensions, selectedCounty, selectedCity, selectedState) => {
    const { width, height } = mapDimensions;

    let yGutter = 1;
    let xGutter = 1;
    // get the centroid based on the selectedGeographicUnit
    let center = [500, 500];
    let dx = 1000;
    let dy = 500 / 960 * 1000;
    if (selectedCounty) {
      yGutter = 0.33;
      xGutter = 0.33;
      ({center, dx, dy} = Centroids.counties[selectedCounty]);
    } else if (selectedCity) {
      yGutter = 1.5;
      xGutter = 1.5;
      center = Centroids.cities[selectedCity];
      ({dx, dy} = Centroids.states[selectedState]);
    } else if (selectedState) {
      yGutter = 0.85;
      xGutter = 0.6;
      ({center, dx, dy} = Centroids.states[selectedState]);
    }

    // for everything other than national you offset the translateX by 125 to account or the 
    //const statsOffset = (selectedState) ? 125 : 0;

    // calculate the scale
    const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;

    const translateX = width / 2 - scale * center[0];
    const translateY = height / 2 - scale * center[1];

    return {
      width,
      height,
      scale,
      translateX,
      translateY,
      basedOn: selectedCounty || selectedCity || selectedState || 'national',
    };
  }
);

export const getLinkUp = createSelector(
  [getSelectedCounty, getSelectedCityMetadata, getSelectedState, getSelectedMapView],
  (selectedCounty, selectedCityMetadata, selectedState, selectedMapView) => {
    if (selectedMapView === 'counties') {
      if (selectedCounty) {
        return `/state/${Counties.find(c => c.j === selectedCounty).s}`;
      }
      if (selectedState) {
        return '/'
      }
    } else {
      if (selectedCityMetadata) {
        return `/state/${selectedCityMetadata.state}#mapview=cities`;
      }
      if (selectedState) {
        return '/maps#mapview=cities'
      }
    }
  }
);

export const getStateSearchOptions = () => {
  return Object.keys(stateabbrs).map(abbr => ({
    value: abbr,
    label: stateabbrs[abbr],
  }));
};

export const getCountiesSearchOptions = () => {
  const abbrs = Object.keys(stateabbrs);
  const countyOptions = {};
  Object.keys(stateabbrs).forEach(abbr => {
    countyOptions[abbr] = [];
  });

  Counties.forEach(c => {
    countyOptions[c.s].push({
      value: c.j,
      label: `${c.n}`,
    });
  });

  Object.keys(countyOptions).forEach(state => {
    countyOptions[state] = countyOptions[state].sort((a, b) => {
      if (b.label < a.label) {
        return 1;
      }
      if (b.label > a.label) {
        return -1;
      }
      return 0;
    })
  });

  return countyOptions;
};

export const getCitiesSearchOptions = () => {
  const abbrs = Object.keys(stateabbrs);

  const citiesOptions = {};
  Cities.forEach(city => {
    citiesOptions[getStateAbbr(city.s)] = citiesOptions[getStateAbbr(city.s)] || [];
    citiesOptions[getStateAbbr(city.s)].push({
      value: city.k,
      label: city.c,
    });

    if (city.otherPlaces) {
      city.otherPlaces.forEach(otherCity => {
        citiesOptions[getStateAbbr(city.s)].push({
          value: city.k,
          label: otherCity.c,
        });
      });
    }
  });

  Object.keys(citiesOptions).forEach(state => {
    citiesOptions[state] = citiesOptions[state].sort((a, b) => (a.label > b.label) ? 1 : -1);
  });

  return citiesOptions;
};

export const getCountiesOrCitiesOptions = createSelector(
  [getSelectedMapView],
  (selectedMapView) => ({
    cities: getCitiesSearchOptions(),
    counties: getCountiesSearchOptions(),
  }),
);

export const getThemesSearchOptions = createSelector(
  [getThemesData],
  (themesData) => {
    // todo: this is broken now that you don't have the themes in state;
    if (!themesData || !themesData.children) {
      return null;
    }
    const options = [];
    Object.keys(themesData.children).forEach(level1 => {
      options.push({
        label: level1,
        value: `root|${level1}`,
      });
      Object.keys(themesData.children[level1].children).forEach(level2 => {
        options.push({
          label: `${level1} / ${level2}`,
          value: `root|${level1}|${level2}`,
        });
        Object.keys(themesData.children[level1].children[level2].children).forEach(level3 => {
          options.push({
            label: `${level1} / ${level2} / ${level3}`,
            value: `root|${level1}|${level2}|${level3}`,
          });
        });
      });
    });
    return options.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });
  }
);

export const getPhotoFetchQueries = createSelector(
  [getSelectedPhoto],
  (id) => {
    // create the queries to get the photo data and similar photo data
    const query = `SELECT * FROM photogrammar_photos where loc_item_link = '${id}' `;
    const queries = [...Array(14).keys()].map(n => n+1).map(x => {
      return `SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos where loc_item_link = (select nn${x} from similarphotos where source = '${id}')`
    });
    const similarPhotosQuery = queries.join(' union ');

    return {
      photoMetadataQuery: `${cartoURLBase}${encodeURIComponent(query)}`,
      similarPhotosQuery: `${cartoURLBase}${encodeURIComponent(similarPhotosQuery)}`
    };
  }
);

export const getMakeLinkFunction = createSelector(
  [getSelectedViz, getSelectedMapView, getSelectedState, getSelectedCounty, getSelectedCity, getSelectedTheme, getSelectedPhotographer, getFilterTerms, getTimeRange],
  (selectedViz, selectedMapView, selectedState, selectedCounty, selectedCity, selectedTheme, selectedPhotographer, filterTerms, timeRange) => {
    return (actions) => {
      const actionTypes = actions.map(a => a.type);
      //console.log(actions, actionTypes);
      const getPayloadFor = (type) => (actions.find(a => a.type === type))
        ? actions.find(a => a.type === type).payload : null;

      const getNextSelectedState = () => {
        if (actionTypes.includes('set_state')) {
          return getPayloadFor('set_state');
        }
        if (actionTypes.includes('clear_state')) {
          return null;
        }
        return selectedState;
      };

      const getNextSelectedCounty = () => {
        if (actionTypes.includes('set_county')) {
          return getPayloadFor('set_county');
        }
        if (actionTypes.includes('clear_county') || actionTypes.includes('set_city')
          || actionTypes.includes('clear_state')) {
          return null;
        }
        return selectedCounty;
      };

      const getNextSelectedCity = () => {
        if (actionTypes.includes('set_city')) {
          return getPayloadFor('set_city');
        }
        if (actionTypes.includes('clear_city') || actionTypes.includes('set_county')
          || actionTypes.includes('clear_state')) {
          return null;
        }
        return selectedCity;
      };

      const getNextSelectedTheme = () => {
        if (actionTypes.includes('set_theme')) {
          return getPayloadFor('set_theme');
        }
        if (actionTypes.includes('clear_theme')) {
          return null;
        }
        if (actionTypes.includes('set_selected_viz') && !selectedTheme) {
          return 'root';
        }
        return selectedTheme;
      };

      const getNextSelectedPhotographer = () => {
        if (actionTypes.includes('set_photographer')) {
          return getPayloadFor('set_photographer');
        }
        if (actionTypes.includes('clear_photographer')) {
          return null;
        }
        return selectedPhotographer;
      };

      const getNextFilterTerms = () => {
        if (actionTypes.includes('set_filter_terms')) {
          return getPayloadFor('set_photo').split(' ');
        }
        if (actionTypes.includes('clear_filter_terms')) {
          return [];
        }
        return filterTerms;
      };

      const getNextTimeRange = () => {
        if (actionTypes.includes('set_time_range')) {
          return getPayloadFor('set_time_range');
        }
        if (actionTypes.includes('clear_time_range')) {
          return [193501, 194406];
        }
        return timeRange;
      };

      const getNextSelectedMapView = () => {
        if (actionTypes.includes('set_selected_map_view')) {
          return getPayloadFor('set_selected_map_view');
        }
        if (actionTypes.includes('set_county')) {
          return 'counties';
        }
        if (actionTypes.includes('set_city')) {
          return 'cities';
        }
        return selectedMapView;
      };

      const getNextSelectedViz = () => {
        if (actionTypes.includes('set_selected_viz')) {
          return getPayloadFor('set_selected_viz');
        }
        if (actionTypes.includes('set_county') || actionTypes.includes('set_city')
          || actionTypes.includes('set_state')) {
          return 'map';
        }
        if (actionTypes.includes('set_theme')) {
          return 'themes';
        }
        return selectedViz;
      }

      const getNextSelectedPhoto= () => {
        if (actionTypes.includes('set_photo')) {
          return getPayloadFor('set_photo');
        }
        if (actionTypes.includes('clear_photo')) {
          return null;
        }
        return null;
      };

      const nextSelectedViz = getNextSelectedViz();
      const nextSelectedMapView = getNextSelectedMapView();
      const nextSelectedState = getNextSelectedState();
      const nextSelectedCounty = getNextSelectedCounty();
      const nextSelectedCity = getNextSelectedCity();
      const nextSelectedTheme = getNextSelectedTheme();
      const nextSelectedPhotographer = getNextSelectedPhotographer();
      const nextSelectedPhoto = getNextSelectedPhoto();
      const nextFilterTerms = getNextFilterTerms();
      const nextTimeRange = getNextTimeRange();

      // build the pathname
      let pathname = '';
      if (nextSelectedPhoto) {
        pathname = `/photo/${nextSelectedPhoto}`;
      }
      if (nextSelectedViz === 'map') {
        if (nextSelectedCounty) {
          pathname = `${pathname}/county/${nextSelectedCounty}`;
        } else if (nextSelectedCity) {
          pathname = `${pathname}/city/${nextSelectedCity}`;
        } else if (nextSelectedState) {
          pathname = `${pathname}/state/${nextSelectedState}`;
        } else if (!nextSelectedPhoto) {
          pathname = `${pathname}/maps`;
        }

        if (nextSelectedPhotographer) {
          pathname = `${pathname}/photographers/${nextSelectedPhotographer}`;
        }
        if (nextSelectedTheme && nextSelectedTheme !== 'root') {
          pathname = `${pathname}/themes/${nextSelectedTheme}`;
        }
        if (nextTimeRange[0] !== 193501 || nextTimeRange[1] !== 194406) {
          pathname = `${pathname}/timeline/${nextTimeRange.join('-')}`;
        }
        if (nextFilterTerms && nextFilterTerms.length > 0) {
          pathname = `${pathname}/caption/${filterTerms.join(' ')}`;
        }
      } else if (nextSelectedViz === 'themes') {
        pathname = `${pathname}/themes/${nextSelectedTheme}`;
        if (nextSelectedCounty) {
          pathname = `${pathname}/county/${nextSelectedCounty}`;
        } else if (nextSelectedCity) {
          pathname = `${pathname}/city/${nextSelectedCity}`;
        } else if (nextSelectedState) {
          pathname = `${pathname}/state/${nextSelectedState}`;
        } 
        if (nextSelectedPhotographer) {
          pathname = `${pathname}/photographers/${nextSelectedPhotographer}`;
        }
        if (nextTimeRange[0] !== 193501 || nextTimeRange[1] !== 194406) {
          pathname = `${pathname}/timeline/${nextTimeRange.join('-')}`;
        }
        if (nextFilterTerms && nextFilterTerms.length > 0) {
          pathname = `${pathname}/caption/${filterTerms.join(' ')}`;
        }
      }

      const hash = (nextSelectedMapView === 'cities') ? '#mapview=cities' : '';

      return `${pathname}${hash}`;
    };  
  }
);
