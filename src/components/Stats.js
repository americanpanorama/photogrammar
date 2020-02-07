import { connect } from 'react-redux';
import Stats from './Stats.jsx';
import { getSelectedCountyMetadata, getSelectedCountyPhotographers, getSelectedStatePhotoCount, getSelectedStatePhotographers, getSelectedStateName } from '../store/selectors';

const mapStateToProps = state => {
  let placeName;
  let numPhotographs;
  let photographers = [];
  if (state.selectedCounty) {
    const { name, state_terr, photoCount } = getSelectedCountyMetadata(state);
    placeName = `${name}, ${state_terr}`;
    numPhotographs = photoCount;
    // get the photographers stats for the county if a photographer isn't selected
    if (!state.selectedPhotographer) {
      photographers = getSelectedCountyPhotographers(state);
    }
  } else if (state.selectedState) {
    placeName = getSelectedStateName(state);
    numPhotographs = getSelectedStatePhotoCount(state);
    photographers = getSelectedStatePhotographers(state);
  }
  return {
    placeName,
    numPhotographs,
    photographers,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
