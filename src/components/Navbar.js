
import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import { selectMapView } from '../store/actions';

const mapStateToProps = state => ({
  selectedViz: state.selectedViz,
  selectedMapView: state.selectedMapView,
  selectedCity: state.selectedCity,
  selectedCounty: state.selectedCounty,
  selectedState: state.selectedState,
});

const mapDispatchToProps = {
  selectMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
