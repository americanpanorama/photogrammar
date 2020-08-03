import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';
import { setPhotoOffset } from '../../store/actions';
import { getSidebarPhotosQuery, getStateAbbr } from '../../store/selectors';

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
  const { displayableCards, width: blankCardWidth, height: blankCardHeight } = dimensions.photoCards;
  const { width: sidebarWidth } = dimensions.sidebar;
  let nextOffset = sidebarPhotosOffset + displayableCards;
  let previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  const photoSetId = [selectedPhotographer, selectedCounty, selectedCity, selectedState, selectedTheme, (expandedSidebar) ? 'expandedSidebar' : '']
    .filter(facet => facet)
    .join(' ');

  return {
    query: getSidebarPhotosQuery(state),
    getStateAbbr,
    photoSetId,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    selectedPhotoCallNumber: (selectedPhotoData && selectedPhotoData.call_number)
      ? selectedPhotoData.call_number : null,
    sidebarWidth,
    blankCardHeight,
    blankCardWidth,
  };
};

const mapDispatchToProps = {
  setPhotoOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPhotos);
