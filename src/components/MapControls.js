import { connect } from 'react-redux';
import MapControls from './MapControls.jsx';
import { selectMapView } from '../store/actions';

const mapStateToProps = state => ({
  selectedMapView: state.selectedMapView
});

const mapDispatchToProps = {
  selectMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapControls);
