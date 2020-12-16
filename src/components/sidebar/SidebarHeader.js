import { connect } from 'react-redux';
import SidebarHeader from './SidebarHeader';
import { setPhotoOffset, toggleExpandedSidebar } from '../../store/actions';
import { getSidebarPhotoCountQuery } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedPhotographer, selectedState, sidebarPhotosOffset, dimensions, selectedTheme, filterTerms, expandedSidebar } = state;
  const { displayableCards } = dimensions.photoCards;
  const nextOffset = sidebarPhotosOffset + displayableCards;
  const previousOffset = (sidebarPhotosOffset - displayableCards >= 0) ? sidebarPhotosOffset - displayableCards : -1;

  return {
    hasFacet: !!(selectedPhotographer || selectedState || filterTerms.length > 0 || selectedTheme !== 'root'),
    query: getSidebarPhotoCountQuery(state),
    timeRange: state.timeRange,
    displayableCards,
    sidebarPhotosOffset,
    previousOffset,
    nextOffset,
    expandedSidebar,
    isMobile: dimensions.isMobile,
  };
};

const mapDispatchToProps = {
  setPhotoOffset,
  toggleExpandedSidebar,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
