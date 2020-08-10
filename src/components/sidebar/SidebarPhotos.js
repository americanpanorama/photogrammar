import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';
import { setPhotoOffset } from '../../store/actions';
import { getSidebarPhotosQuery } from '../../store/selectors';

const mapStateToProps = state => {
  const { 
    selectedPhotographer,
    selectedCity,
    selectedCounty,
    selectedState,
    selectedTheme,
    sidebarPhotosOffset,
    selectedPhotoData,
    dimensions,
    expandedSidebar,
  } = state;
  const { displayableCards } = dimensions.photoCards;

  const photoSetId = [selectedPhotographer, selectedCounty, selectedCity, selectedState, selectedTheme, (expandedSidebar) ? 'expandedSidebar' : '']
    .filter(facet => facet)
    .join(' ');

  return {
    query: getSidebarPhotosQuery(state),
    photoSetId,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset: (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1,
    nextOffset: sidebarPhotosOffset + displayableCards,
    selectedPhotoCallNumber: (selectedPhotoData && selectedPhotoData.call_number)
      ? selectedPhotoData.call_number : null,
    sidebarWidth: dimensions.sidebar,
    cardDimensions: dimensions.photoCards,
  };
};

const mapDispatchToProps = {
  setPhotoOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPhotos);
