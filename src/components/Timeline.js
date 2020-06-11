import { connect } from 'react-redux';
import Timeline from './Timeline.jsx';
import { selectPhotographer, clearPhotographer } from '../store/actions';
import { getTimelineHeatmapRows } from '../store/selectors';

const mapStateToProps = state => {
  const {
    photographers,
    translateY,
    monthWidth,
    monthHeight,
  } = getTimelineHeatmapRows(state);
  const { selectedPhotographer, timeRange, dimensions } = state;

  return {
    photographers,
    selectedPhotographer,
    timeRange,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    translateY,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    monthHeight,
    monthWidth,
  };
};

const mapDispatchToProps = {
  selectPhotographer,
  clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
