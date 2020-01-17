import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';
import { loadSidebarPhotos } from '../../store/actions';
import { getSelectedPhotographerMetadata, getSelectedCountyMetadata } from '../../store/selectors';

const mapStateToProps = state => {
  const { sidebarPhotos, selectedPhotographer, selectedCounty, sidebarPhotosOffset, dimensions } = state;
  const { displayableCards } = dimensions.photoCards;
  const { width: sidebarWidth } = dimensions.sidebar;
  let nextOffset = sidebarPhotosOffset + displayableCards;
  let previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  let selectedPhotographerName;
  if (selectedPhotographer) {
    const { firstname, lastname } = getSelectedPhotographerMetadata(state);
    selectedPhotographerName = `${firstname} ${lastname}`;
  }

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
    photos: sidebarPhotos,
    selectedPhotographer,
    selectedCounty,
    header,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    selectedPhotoCallNumber: (state.selectedPhotoData && state.selectedPhotoData.call_number)
      ? state.selectedPhotoData.call_number : null,
    sidebarWidth,
  };
};

const mapDispatchToProps = {
  loadSidebarPhotos,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPhotos);
