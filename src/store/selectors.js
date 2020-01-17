import { createSelector } from 'reselect';
import counties from '../../public/data/counties.json';
import Photographers from '../../public/data/photographers.json';

const getSelectedPhotographer = state => state.selectedPhotographer;
const getSelectedCounty = state => state.selectedCounty;
const getCountiesData = state => state.countiesData;

export const getCounties = createSelector(
  [getCountiesData],
  (countiesData) => {
    return counties.features.map((f) => {
      const photoCount = (countiesData[f.properties.nhgis_join]) ? countiesData[f.properties.nhgis_join].total : 0;
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

export const getSelectedCountyMetadata = createSelector(
  [getSelectedCounty],
  (selectedCounty) => {
    return counties.features.find(c => c.properties.nhgis_join === selectedCounty).properties;
  }
);
