import { connect } from 'react-redux';
import Timeline from './Timeline.jsx';
import { getTimelineCellsFetchPath } from '../store/selectors';

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
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
