import { connect } from 'react-redux';
import SidebarHeader from './SidebarHeader.jsx';
import { setPhotoOffset } from '../../store/actions';
import { getSelectedCountyMetadata, getSelectedPhotographerName, getSelectedStateName, getDateRangeString } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedCounty, sidebarPhotosOffset, dimensions } = state;
  const { displayableCards } = dimensions.photoCards;
  const nextOffset = sidebarPhotosOffset + displayableCards;
  const previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  const selectedPhotographerName = getSelectedPhotographerName(state);
  const selectedStateName = getSelectedStateName(state);

  let placeName;
  if (selectedCounty) {
    const { name: countyName, stateAbbr } = getSelectedCountyMetadata(state);
    placeName = `${countyName}, ${stateAbbr}`;
  } else if (selectedStateName) {
    placeName = selectedStateName;
  }

  let label = `${(selectedPhotographerName) ? selectedPhotographerName : ''}${(selectedPhotographerName && placeName) ? ' - ' : ''}${(placeName) ? placeName : ''}`;
  if (label === '') {
    label = 'Random selection of photographs';
  }

  return {
    label,
    dateStr: getDateRangeString(state),
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    selectedPhotoCallNumber: (state.selectedPhotoData && state.selectedPhotoData.call_number)
      ? state.selectedPhotoData.call_number : null,
  };
};

const mapDispatchToProps = {
  setPhotoOffset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
