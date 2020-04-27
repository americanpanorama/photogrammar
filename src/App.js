import { connect } from 'react-redux';
import App from './App.jsx';
import { initializeData, windowResized, selectMapView} from './store/actions';

const mapStateToProps = state => {
  const { selectedViz, selectedMapView, dimensions, isInitialized } = state;
  let className = '';
  if (selectedViz === 'themes') {
    className = 'themes';
  } else if (selectedViz === 'map') {
    className = selectedMapView;
  }
  return {
    dimensions,
    isInitialized,
    selectedViz,
    selectedMapView,
    className,
  };
};

const mapDispatchToProps = {
  initializeData,
  windowResized,
  selectMapView,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
