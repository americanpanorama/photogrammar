import { connect } from 'react-redux';
import Timeline from './Timeline.jsx';
import { getTimelineCellsFetchPath, getBuildLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedPhotographer, timeRange, dimensions, selectedMapView } = state;

  return {
    fetchPath: getTimelineCellsFetchPath(state),
    selectedPhotographer,
    timeRange,
    dimensions,
    selectedMapView,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    buildLink: getBuildLinkFunction(state),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
