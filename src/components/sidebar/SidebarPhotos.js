import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';
import { loadSidebarPhotos } from '../../store/actions';
import { getSelectedPhotographerMetadata, getSelectedCountyMetadata, getSelectedStateName, getSelectedPhotographerName } from '../../store/selectors';

const mapStateToProps = state => {
  const { sidebarPhotos, selectedPhotographer, selectedCounty, selectedState, sidebarPhotosOffset, randomPhotoNumbers, dimensions } = state;
  const { displayableCards } = dimensions.photoCards;
  const { width: sidebarWidth } = dimensions.sidebar;
  let nextOffset = sidebarPhotosOffset + displayableCards;
  let previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  const selectedPhotographerName = getSelectedPhotographerName(state);

  let selectedCountyName;
  if (selectedCounty) {
    const { name: countyName, stateAbbr } = getSelectedCountyMetadata(state);
    selectedCountyName = `${countyName}, ${stateAbbr}`;
  }

  let header = `${(selectedPhotographerName) ? selectedPhotographerName : ''}${(selectedPhotographerName && selectedCountyName) ? ' - ' : ''}${(selectedCountyName) ? selectedCountyName : ''}`;
  if (header === '') {
    header = 'Random selection of photographs';
  }

  return {
    selectedPhotographer,
    selectedPhotographerName,
    selectedCounty,
    selectedState,
    selectedStateName: getSelectedStateName(state),
    header,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    selectedPhotoCallNumber: (state.selectedPhotoData && state.selectedPhotoData.call_number)
      ? state.selectedPhotoData.call_number : null,
    sidebarWidth,
    randomPhotoNumbers,
  };
};

const mapDispatchToProps = {
  loadSidebarPhotos,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPhotos);
