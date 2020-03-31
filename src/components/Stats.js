import { connect } from 'react-redux';
import Stats from './Stats.jsx';
import {
  getSelectedCountyMetadata,
  getSelectedCityMetadata,
  getSelectedCountyPhotographers,
  getSelectedStatePhotoCount,
  getSelectedStatePhotographers,
  getSelectedStateName,
  getSidebarPhotoCountQuery,
  getPhotographersCountQuery,
} from '../store/selectors';

const mapStateToProps = state => {
  let placeName;
  let numPhotographs = 0;
  let photographers = [];
  if (state.selectedCounty) {
    const { name, state_terr, photoCount } = getSelectedCountyMetadata(state);
    placeName = `${name}, ${state_terr}`;
    numPhotographs = photoCount;
    // get the photographers stats for the county if a photographer isn't selected
    if (!state.selectedPhotographer) {
      photographers = getSelectedCountyPhotographers(state);
    }
  } else if (state.selectedCity) {
    const { city, total, photographers, otherPlaces }  = getSelectedCityMetadata(state);
    const otherPlacesTotal = (otherPlaces && otherPlaces.length > 0) ? otherPlaces.reduce((accumulator, current) => accumulator + current.total, 0) : 0;
    const placeNames = [`${city} (${total - otherPlacesTotal})`];
    if (otherPlaces) {
      otherPlaces
      .sort((a, b) => b.total - a.total)
      .forEach(op => {
        placeNames.push(`${op.city} (${op.total})`);
      });
    }
    placeName = placeNames.join(', ');
  } else if (state.selectedState) {
    placeName = getSelectedStateName(state);
    numPhotographs = getSelectedStatePhotoCount(state);
    photographers = getSelectedStatePhotographers(state);
  }
  return {
    placeName,
    numPhotographs,
    photographers,
    photoCountQuery: getSidebarPhotoCountQuery(state),
    photographersCountQuery: getPhotographersCountQuery(state),
    maxHeight: state.dimensions.map.height,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
