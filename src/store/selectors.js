import { createSelector } from 'reselect';
import * as d3 from 'd3';
import counties from '../../public/data/counties.json';
import Counties from '../../data/svgs/counties.json';
import Photographers from '../../public/data/photographers.json';
import StateCounts from '../../public/data/stateCounts.json';
import Cities from '../../public/data/citiesCounts.json';
import Centroids from '../../data/centroids.json';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};

const getSelectedPhotographer = state => state.selectedPhotographer;
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

export const getPhotographers = (min = 0, max = 50000) => (
  Photographers.filter(p => p.count >= min && p.count <= max)
);
export const getCentroidForCounty = (nhgis_join) => Centroids.counties[nhgis_join];

export const getSelectedPhotographerMetadata = createSelector(
  [getSelectedPhotographer],
  (selectedPhotographer) => {
    return Photographers.find(p => p.key === selectedPhotographer);
  }
);

export const getSelectedPhotographerName = createSelector(
  [getSelectedPhotographerMetadata],
  (md) => (md && md.firstname && md.lastname) ? `${md.firstname} ${md.lastname}` : null
);

export const getCounties = createSelector(
  [getCountiesData, getTimeRange, getSelectedCounty, getSelectedState],
  (countiesData, timeRange, selectedCounty, selectedState) => {
    return Counties
      .filter(county => {
        const { j: nhgis_join, s: state } = county;
        if (!nhgis_join || nhgis_join === 'NULL') {
          return false;
        }
        if (selectedState && state !== selectedState) {
          return false;
        }
        return true;
      })
      .map(county => {
        const { j: nhgis_join, a: area_sqmi, s: state, n: name, d, l: labelCoords } = county;
        let photoCount;
        const [startTime, endTime] = timeRange;
        if (!countiesData[nhgis_join]) {
          photoCount = 0;
        } else if (startTime > 193501 || endTime < 194504) {
          photoCount = Object
            .keys(countiesData[nhgis_join])
            .filter(k => {
              if (k === 'total' || k === 'photographers') {
                return false;
              }
              return k.substring(1) >= startTime && k.substring(1) <= endTime;
            })
            .reduce((accumulator, k) => {
              return countiesData[nhgis_join][k] + accumulator;
            }, 0);
        } else {
          photoCount = countiesData[nhgis_join].total;
        }
        const fill = (photoCount > 0) ? '#6a1b9a' : 'white'; //'#eceff1';
        const fillOpacity = (photoCount > 0) ? Math.min(1, photoCount * 50 / area_sqmi + 0.1) : 0.75;
        const centroidData = getCentroidForCounty(nhgis_join);
        const { center } = centroidData;
        const strokeOpacity = (photoCount > 0) ? 1 : 0;
        return {
          d,
          name,
          state,
          nhgis_join,
          area_sqmi,
          fill,
          fillOpacity,
          strokeOpacity,
          photoCount,
          center,
          labelCoords,
        };
      });
  }
);

export const getCities = createSelector(
  [getCitiesData, getTimeRange, getSelectedState],
  (citiesData, timeRange, selectedState) => {
    if (Object.keys(citiesData).length === 0) {
      return [];
    }
    return Cities
      .filter(cd => {
        if (selectedState && cd.state !== selectedState) {
          return false;
        }
        return true;
      })
      .map(cd => {
        const { key, city, state } = cd;
        let total;
        const [startTime, endTime] = timeRange;
        //console.log(citiesData[key]);
        if (!citiesData[key]) {
          total = 0;
        } else if (startTime > 193501 || endTime < 193504) {
          total = Object
            .keys(citiesData[key])
            .filter(k => {
              if (k === 'total' || k === 'photographers') {
                return false;
              }
              return k.substring(1) >= startTime && k.substring(1) <= endTime;
            })
            .reduce((accumulator, k) => {
              return citiesData[key][k] + accumulator;
            }, 0);
        } else {
          total = citiesData[key].total;
        }
        //console.log(key, total);
        return {
          key,
          total,
          city,
          state,
          center: Centroids.cities[key],
        }
      });
  }
);

export const getThemes = createSelector(
  [getThemesData, getTimeRange, getSelectedTheme, getSelectedPhotographerName, getDimensions],
  (themesData, timeRange, selectedTheme, selectedPhotographerName, dimensions) => {
    const { height, width } = dimensions.map;

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([20, height]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const wheres = ['img_large_path != \'\''];
    if (selectedPhotographerName) {
      wheres.push(`photographer_name = '${selectedPhotographerName}'`);
    }
    const themesPaths = selectedTheme.split('|').slice(1);
    const name = themesPaths[themesPaths.length - 1];
    let rawThemes;
    if (themesPaths.length === 0) {
      rawThemes = themesData.children;
    } else if (themesPaths.length === 1) {
      rawThemes = themesData.children[themesPaths[0]].children;
      wheres.push([`vanderbilt_level1 = '${themesPaths[0]}'`]);
    } else if (themesPaths.length >= 2 ) {
      rawThemes = themesData.children[themesPaths[0]].children[themesPaths[1]].children;
      wheres.push([`vanderbilt_level1 = '${themesPaths[0]}'`]);
      wheres.push([`vanderbilt_level2 = '${themesPaths[1]}'`]);
    }

    const [startTime, endTime] = timeRange;

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

    // organize the data for d3
    const organizedThemeData = {
      name: selectedTheme,
      children: Object.keys(rawThemes).map(theme => {
        let photoCount = rawThemes[theme].total;
        if (startTime > 193501 || endTime < 194504) {
          photoCount = Object
            .keys(rawThemes[theme])
            .filter(k => {
              if (k === 'total' || k === 'photographers') {
                return false;
              }
              return k.substring(1) >= startTime && k.substring(1) <= endTime;
            })
            .reduce((accumulator, k) => {
              return rawThemes[theme][k] + accumulator;
            }, 0);
        }
        return {
          name: theme,
          key: `${selectedTheme}|${theme}`,
          value: photoCount,
        };
      })
    };
    const themesHierarchy = d3.hierarchy(organizedThemeData)
      .sum(d => d.value)
      .sort((a, b) => {
        let order;
        if (selectedTheme === 'root') {
          order = ["Work", "People As Such", "Homes and Living Conditions", "Cities and Towns", "Social and Personal Activity", "The Land", "Transportation", "War", "Organized Society", "Religion", "Medicine and Health", "Itellectual and Creative Activity", "Alphabetical Section"];
          return order.indexOf(a.data.name) - order.indexOf(b.data.name);
        }
        return b.value - a.value
      });
    const treemap = d3.treemap().tile(d3.treemapSquarify.ratio(1))(themesHierarchy);

    const themesCoords = treemap.children.map((child, idx) => {
      // make the id--those on the bottom of the hierarchy need to be adjusted if they're selected to be their immediate ancestor
      const id = (themesPaths.length <= 2) ? `${selectedTheme}|${child.data.name}` : `root|${themesPaths.slice(0, themesPaths.length - 1).join('|')}|${child.data.name}`;

      // style for selection at the bottom level
      let strokeWidth = width / 200;
      let fontColor = 'white';
      let fillOpacity = 0.11;
      let link = id;
      let fill = color(child.data.name);
      if (themesPaths.length === 3 && selectedTheme && selectedTheme !== id) {
        fontColor = '#aaa';
        fill = '#888';
        fillOpacity = 0.22;
      }
      if (themesPaths.length === 3 && selectedTheme && selectedTheme === id) {
        link = id.substring(0, id.lastIndexOf('|'));
      }
      return {
        name: child.data.name,
        transformX: x(child.x0),
        transformY: y(child.y0),
        width: x(child.x1) - x(child.x0),
        height: y(child.y1) - y(child.y0),
        fill,
        fillOpacity,
        id,
        link,
        strokeWidth,
        fontColor,
      };
    });

    // make the query 
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const topLevel = Math.min(themesPaths.length + 1, 3);
    const query = `SELECT pp.vanderbilt_level${topLevel} as theme, (SELECT p.img_medium_path FROM photogrammar_photos as p where ${wheres.join(' and ')} and pp.vanderbilt_level${topLevel} = p.vanderbilt_level${topLevel} order by random() limit 1) as img FROM digitalscholarshiplab.photogrammar_photos as pp where ${wheres.join(' and ')} group by vanderbilt_level${topLevel}`;

    return {
      name,
      themes: themesCoords,
      query: encodeURI(`${cartoURLBase}${query}`),
      ancestors: themesPaths.slice(0, topLevel - 1).map((theme, idx) => ({
          name: theme,
          key: ['root'].concat(themesPaths.slice(0, idx + 1)).join('|'),
        })),
    };
  }
);

export const getSelectedCountyMetadata = createSelector(
  [getSelectedCounty, getCountiesData],
  (selectedCounty, countiesData) => {
    const county = counties.features.find(c => c.properties.nhgis_join === selectedCounty);
    if (county && county.properties) {
      const photoCount = (countiesData[county.properties.nhgis_join]) ? countiesData[county.properties.nhgis_join].total : 0;
      return {
        ...county.properties,
        photoCount,
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

export const makeWheres = (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, wheresForCityQuery, selectedViz, selectedTheme, selectedMapView, filterTerms) => {
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

    if (selectedViz === 'themes' && selectedTheme) {
      const themesPaths = selectedTheme.split('|').slice(1);
      if (themesPaths.length >= 1) {
        wheres.push([`vanderbilt_level1 = '${themesPaths[0]}'`]);
      } 
      if (themesPaths.length >= 2) {
        wheres.push([`vanderbilt_level2 = '${themesPaths[1]}'`]);
      } 
      if (themesPaths.length === 3) {
        wheres.push([`vanderbilt_level3 = '${themesPaths[2]}'`]);
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

export const getSidebarPhotosWheres = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getWheresForCityQuery, getSelectedViz, getSelectedTheme, getSelectedMapView, getFilterTerms],
  makeWheres,
);

export const getSidebarPhotosQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getSidebarPhotosOffset, getDimensions, getRandomPhotoNumbers, getSelectedMapView, getWheresForCityQuery, getSelectedViz, getSelectedTheme, getSidebarPhotosWheres],
  (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, offset, dimensions, randomPhotoNumbers, selectedMapView, wheresForCityQuery, selectedViz, selectedTheme, wheres) => {
    let query;
    const { displayableCards } = dimensions.photoCards;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT * FROM photogrammar_photos';
    if (wheres.length > 0) {
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      query = `${sqlQueryBase} ${where} order by year, month limit ${displayableCards} offset ${offset}`;
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

export const getSidebarPhotoCountQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedCity, getSelectedState, getTimeRange, getSelectedMapView, getSidebarPhotosWheres],
  (selectedPhotographer, selectedCounty, selectedCity, selectedState, timeRange, selectedMapView, wheres) => {
    let query;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT count(cartodb_id) FROM photogrammar_photos';
    if (wheres.length > 0) {
      const where = (wheres.length > 0) ? `where ${wheres.join(' and ')}` : null;
      query = `${sqlQueryBase} ${where}`;
      return encodeURI(`${cartoURLBase}${query} `);
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
    const startString = `${monthNames[yearMonths[0].month]} ${yearMonths[0].year}`;
    const endString = `${monthNames[yearMonths[1].month]} ${yearMonths[1].year}`;
    return `${startString}-${endString}`;
  }
);

export const getMapLink = createSelector(
  [getSelectedCounty, getSelectedState],
  (selectedCounty, selectedState) => {
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
    let center = [0.5, 0.5];
    let dx = 1;
    let dy = 500 / 960;
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
  [getSelectedCounty, getSelectedCityMetadata, getSelectedState, getCounties],
  (selectedCounty, selectedCityMetadata, selectedState, counties) => {
    if (selectedCounty) {
      return `/state/${counties.find(c => c.nhgis_join === selectedCounty).state}`;
    }
    if (selectedCityMetadata) {
      console.log(selectedCityMetadata);
      return `/state/${selectedCityMetadata.state}`;
    }
    if (selectedState) {
      return '/'
    }
  }
);

export const getTimelineHeatmapRows = createSelector(
  [getTimelineCells, getTimeRange, getSelectedPhotographer, getDimensions, getSelectedMapView],
  (timelineCells, timeRange, selectedPhotographer, dimensions, selectedMapView) => {
    // convenience functions for dates
    const monthNum = m => (m - 1) / 12;
    const getTimeCode = (year, month) => year * 100 + month;
    const timeCodeToNum = timecode => Math.floor(timecode / 100) + monthNum(timecode % 100);
  
    const baseColor = (selectedMapView === 'counties') ? '#6a1b9a' : '#289261';

    // create the basic photographers data
    const filteredCells = timelineCells.filter(tc => tc.year < 1944 || tc.month <= 6);
    const activePhotographers = filteredCells.map(tc => tc.photographer);
    const opacityDenominator = Math.min(200, Math.max(...filteredCells.map(tc => tc.count)));
    const threshold = 500;
    const photographers = getPhotographers(75)
      .filter(p => p.key !== 'unspecified')
      .sort((a, b) => {
        if (a.count < threshold && b.count >= threshold) {
          return -1;
        }
        if (a.count >= threshold && b.count < threshold) {
          return 1;
        }
        if (a.firstDate !== b.firstDate) {
          return (a.count >= 500) ? a.firstDate - b.firstDate : b.firstDate - a.firstDate;
        }
        if (a.lastDate != b.lastDate) {
          return (a.count >= 500) ? a.lastDate - b.lastDate : b.lastDate - a.lastDate;
        }
        return 0;
      })
      .map(p => {
        p.active = (activePhotographers.includes(p.key)
          && timeRange[1] > p.firstDate && timeRange[0] < p.lastDate);
        p.fill = (p.active) ? 'black' : 'silver';
        p.months = [];
        p.isOther = p.count < 500;
        return p;
      });

    // use the number above threshold and number below to calculate height and translateY offset
    const { leftAxisWidth, width, height } = dimensions.timelineHeatmap;

    const x = d3.scaleLinear()
      .domain([1935, 1944 + monthNum(6)])
      .range([leftAxisWidth, width + leftAxisWidth]);
    const monthWidth = x(1935 + monthNum(2)) - x(1935);

    // add the timeline cells to each photographer
    filteredCells.forEach(tc => {
      const idx = photographers.findIndex(p => p.key === tc.photographer);
      if (idx !== -1) {
        const cell = {
          year: tc.year,
          month: tc.month,
          count: tc.count,
          x: x(tc.year + monthNum(tc.month)),
          fill: baseColor,
          inSelection: (!(getTimeCode(tc.year, tc.month) < timeRange[0] || getTimeCode(tc.year, tc.month) > timeRange[1]) && (!selectedPhotographer || selectedPhotographer === tc.photographer)),
          fillOpacity: (tc.count > 0) ? 0.05 + 0.95 * tc.count / opacityDenominator : 0
        }
        photographers[idx].months.push(cell);
      }
    });

    // drop any photographers without month data
    // photographers.forEach((p, i) => {
    //   if (p.months.length === 0) {
    //     photographers.splice(i, 1);
    //   }
    // });
    // drop BarbaraEvans, who uniquely has more than 75 photos but none with a month
    const beIdx = photographers.findIndex(p => p.key === "BarbaraWright");
    photographers.splice(beIdx, 1);

    // sort the cells in chronological order
    photographers.forEach(p => {
      p.months = p.months.sort((a, b) => getTimeCode(a.year, a.month) - getTimeCode(b.year, b.month));
    });

    const numberAboveThreshold = photographers.filter(p => !p.isOther).length;
    const numberBelowThreshold = photographers.filter(p => p.isOther).length;
    // the +/-1 here are to leave room for the collective "other photographers" when they aren't individual shown
    const rowHeight = height / (numberAboveThreshold + 2);
    const translateY = -1 * rowHeight * (numberBelowThreshold);
    const monthHeight = rowHeight - 2;

    // the +1 here is for an empty row for the "other photographers" to separate the two visually
    const y = d3.scaleLinear()
        .domain([0, photographers.length + 1])
        .range([0, height - translateY]);

    // add the y, labelX, and yeartick values for each photographer
    photographers.forEach((p, i) => {
      photographers[i].y = (p.isOther) ? y(i) + 1 : y(i + 2) + 1;
      photographers[i].labelX = x(Math.floor(p.firstDate / 100)) - 5;
      photographers[i].yearTicks = [];
      [1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945].forEach(y => {
        if (!p.isOther || y >= Math.floor(p.firstDate / 100)) {
          let stroke = 'black';
          // lighten if it's before photographers first data
          if (y < Math.floor(p.firstDate / 100)) {
            stroke = '#ddd';
          }
          // or if it's not within the time range
          if (y * 100 < timeRange[0] || y * 100 > timeRange[1]) {
            stroke = '#ddd';
          }
          photographers[i].yearTicks.push({
            x: x(y) - 0.25,
            stroke,
          });
        }
      });
    });

    return {
      photographers,
      translateY,
      monthWidth,
      monthHeight,
      baseColor,
    }

  }
);


