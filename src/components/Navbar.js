
import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import { toggleSearch } from '../store/actions';

const mapStateToProps = state => ({
  selectedViz: state.selectedViz,
  selectedMapView: state.selectedMapView,
  selectedCity: state.selectedCity,
  selectedCounty: state.selectedCounty,
  selectedState: state.selectedState,
  isMobile: state.dimensions.isMobile,
});

const mapDispatchToProps = {
  toggleSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
