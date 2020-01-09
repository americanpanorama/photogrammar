import { createSelector } from 'reselect';
import counties from '../../public/data/counties.json';

const getSelectedPhotographer = state => state.selectedPhotographer;
const getCountiesData = state => state.countiesData;
const getSelectedCounty = state => state.selectedCounty;

export const getCounties = createSelector(
  [getCountiesData],
  (countiesData) => {
    return counties.features.map((f) => {
      const photoCount = (countiesData[f.properties.nhgis_join]) ? countiesData[f.properties.nhgis_join].total : 0;
      const fillOpacity = (photoCount > 0) ? photoCount * 50 / f.properties.area_sqmi + 0.05 : 0;
      return {
        ...f,
        properties: {
          ...f.properties,
          fillOpacity,
        },
      };
    });
  }
);
