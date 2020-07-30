import { connect } from 'react-redux';
import Map from './Map.jsx';
import { getMapParameters, getLinkUp, getMapFetchPath } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedMapView, selectedCounty, selectedCity, selectedPhotographer, selectedState, timeRange, filterTerms } = state;
  return {
    timeRange: timeRange,
    selectedPhotographer,
    selectedCounty,
    selectedCity,
    selectedState,
    selectedMapView,
    filterTerms,
    mapParameters: getMapParameters(state),
    linkUp: getLinkUp(state),
    isSearching: state.filterTerms.length > 0,
    fetchPath: getMapFetchPath(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
