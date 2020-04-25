import { connect } from 'react-redux';
import SidebarHeader from './SidebarHeader.jsx';
import { setPhotoOffset, setFilterTerms } from '../../store/actions';
import { getSelectedCountyMetadata, getSelectedPhotographerName, getSelectedStateName, getDateRangeString } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedCounty, sidebarPhotosOffset, dimensions, selectedTheme } = state;
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

  const labelPieces = [];
  if (selectedPhotographerName) {
    labelPieces.push(selectedPhotographerName);
  }
  if (selectedTheme && selectedTheme !== 'root') {
    labelPieces.push(selectedTheme.substring(selectedTheme.lastIndexOf('|') + 1));
  }
  if (placeName) {
    labelPieces.push(placeName);
  }
  let label = (labelPieces.length > 0) ? labelPieces.join(' - ') : 'Random selection of photographs';

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
  setFilterTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
