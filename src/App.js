import { connect } from 'react-redux';
import App from './App.jsx';
import { initializeData, windowResized } from './store/actions';

const mapStateToProps = state => {
  const { selectedViz, selectedMapView, isInitialized, hasCompletedFirstLoad, expandedSidebar, dimensions } = state;
  let className = '';
  if (selectedViz === 'themes') {
    className = 'themes';
  } else if (selectedViz === 'map') {
    className = selectedMapView;
  }

  if (expandedSidebar) {
    className = `${className} expandedSidebar`;
  }

  return {
    isInitialized,
    hasCompletedFirstLoad,
    className,
    isMobile: dimensions.isMobile,
  };
};

const mapDispatchToProps = {
  initializeData,
  windowResized
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
