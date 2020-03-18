import { createSelector } from 'reselect';
import counties from '../../public/data/counties.json';
import Photographers from '../../public/data/photographers.json';
import StateCounts from '../../public/data/stateCounts.json';
import Centroids from '../../public/data/countyCentroids.json';
const stateabbrs = {"AL": "Alabama", "AK": "Alaska", "AS": "American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FM": "Federated States Of Micronesia", "FL": "Florida", "GA": "Georgia", "GU": "Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MH": "Marshall Islands", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "MP": "Northern Mariana Islands", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW": "Palau", "PA": "Pennsylvania", "PR": "Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"};

const getSelectedPhotographer = state => state.selectedPhotographer;
const getSelectedCounty = state => state.selectedCounty;
const getSelectedState = state => state.selectedState;
const getCountiesData = state => state.countiesData;
const getTimeRange = state => state.timeRange;
const getSidebarPhotosOffset = state => state.sidebarPhotosOffset;
const getDimensions = state => state.dimensions;
const getRandomPhotoNumbers = state => state.randomPhotoNumbers;

export const getPhotographers = () => Photographers;
export const getCentroidForCounty = (nhgis_join) => Centroids[nhgis_join];

export const getCounties = createSelector(
  [getCountiesData, getTimeRange],
  (countiesData, timeRange) => {
    return counties.features.map((f) => {
      let photoCount;
      const [startTime, endTime] = timeRange;
      if (!countiesData[f.properties.nhgis_join]) {
        photoCount = 0;
      } else if (startTime > 193501 || endTime < 193504) {
        photoCount = Object
          .keys(countiesData[f.properties.nhgis_join])
          .filter(k => {
            if (k === 'total' || k === 'photographers') {
              return false;
            }
            return k.substring(1) >= startTime && k.substring(1) <= endTime;
          })
          .reduce((accumulator, k) => {
            return countiesData[f.properties.nhgis_join][k] + accumulator;
          }, 0);
      } else {
        photoCount = countiesData[f.properties.nhgis_join].total;
      }
      const fill = (photoCount > 0) ? '#6a1b9a' : 'white'; //'#eceff1';
      const fillOpacity = (photoCount > 0) ? Math.min(1, photoCount * 50 / f.properties.area_sqmi + 0.1) : 0.75;
      const strokeOpacity = (photoCount > 0) ? 1 : 0;
      return {
        ...f,
        properties: {
          ...f.properties,
          fill,
          fillOpacity,
          strokeOpacity,
          photoCount,
        },
      };
    });
  }
);

export const getSelectedPhotographerMetadata = createSelector(
  [getSelectedPhotographer],
  (selectedPhotographer) => {
    return Photographers.find(p => p.key === selectedPhotographer);
  },
);

export const getSelectedPhotographerName = createSelector(
  [getSelectedPhotographerMetadata],
  (md) => (md && md.firstname && md.lastname) ? `${md.firstname} ${md.lastname}` : null
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

export const getSidebarPhotosQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedState, getTimeRange, getSidebarPhotosOffset, getDimensions, getRandomPhotoNumbers],
  (selectedPhotographer, selectedCounty, selectedState, timeRange, offset, dimensions, randomPhotoNumbers) => {
    let query;
    const { displayableCards } = dimensions.photoCards;
    const [startTime, endTime] = timeRange;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT photographer_name, caption, year, month, city, county, state, nhgis_join, img_thumb_img, img_large_path, loc_item_link, call_number FROM photogrammar_photos';
    const wheres = [];
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
  [getSelectedPhotographer, getSelectedCounty, getSelectedState, getTimeRange],
  (selectedPhotographer, selectedCounty, selectedState, timeRange) => {
    let query;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT count(cartodb_id) FROM photogrammar_photos';
    const [startTime, endTime] = timeRange;
    const wheres = [];
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
      query = `${sqlQueryBase} ${where}`;
      return encodeURI(`${cartoURLBase}${query} `);
    } 
    return null;
  }
);

export const getPhotographersCountQuery = createSelector(
  [getSelectedPhotographer, getSelectedCounty, getSelectedState, getTimeRange, getSidebarPhotosOffset, getDimensions, getRandomPhotoNumbers],
  (selectedPhotographer, selectedCounty, selectedState, timeRange, offset, dimensions, randomPhotoNumbers) => {
    let query;
    const { displayableCards } = dimensions.photoCards;
    const [startTime, endTime] = timeRange;
    const cartoURLBase = 'https://digitalscholarshiplab.cartodb.com/api/v2/sql?format=JSON&q=';
    const sqlQueryBase = 'SELECT photographer_name, count(photographer_name) FROM photogrammar_photos';
    const wheres = [];
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




