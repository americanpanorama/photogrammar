import { connect } from 'react-redux';
import Map from './Map.jsx';
import { getSelectedCityMetadata, getCounties, getCities, getMapParameters, getLinkUp } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedMapView} = state;
  return {
    counties: (selectedMapView === 'counties') ? getCounties(state) : [],
    cities: (selectedMapView === 'cities') ? getCities(state) : [],
    selectedCounty: state.selectedCounty,
    selectedCity: state.selectedCity,
    selectedState: state.selectedState,
    selectedMapView,
    mapParameters: getMapParameters(state),
    linkUp: getLinkUp(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
