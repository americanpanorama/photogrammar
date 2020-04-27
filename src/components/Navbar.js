
import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import { selectMapView } from '../store/actions';

const mapStateToProps = state => ({
  selectedViz: state.selectedViz,
  selectedMapView: state.selectedMapView,
});

const mapDispatchToProps = {
  selectMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
