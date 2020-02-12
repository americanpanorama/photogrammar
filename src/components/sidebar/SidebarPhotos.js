import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';
import { setPhotoOffset } from '../../store/actions';

const mapStateToProps = state => {
  const { 
    selectedPhotographer,
    selectedCounty,
    selectedState,
    sidebarPhotosOffset,
    selectedPhotoData,
    dimensions,
  } = state;
  const { displayableCards } = dimensions.photoCards;
  const { width: sidebarWidth } = dimensions.sidebar;
  let nextOffset = sidebarPhotosOffset + displayableCards;
  let previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  return {
    photoSetId: `${(selectedPhotographer) ? selectedPhotographer : ''}${(selectedCounty) ? selectedCounty : ''}${(selectedState) ? selectedState : ''}`,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    selectedPhotoCallNumber: (selectedPhotoData && selectedPhotoData.call_number)
      ? selectedPhotoData.call_number : null,
    sidebarWidth,
  };
};

const mapDispatchToProps = {
  setPhotoOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPhotos);
