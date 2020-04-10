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
    baseColor,
  } = getTimelineHeatmapRows(state);
  const { selectedState, selectedCounty, selectedPhotographer, timeRange, dimensions } = state;

  return {
    photographers,
    selectedState,
    selectedCounty,
    selectedPhotographer,
    timeRange,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    translateY,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    monthHeight,
    monthWidth,
    textColor: baseColor,
  }
};

const mapDispatchToProps = {
  selectPhotographer,
  clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
