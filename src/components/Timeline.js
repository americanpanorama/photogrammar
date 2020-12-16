import { connect } from 'react-redux';
import Timeline from './Timeline.tsx';
import { getTimelineCellsFetchPath, getMakeLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedPhotographer, timeRange, dimensions, selectedMapView, selectedViz } = state;
  let baseColor;
  if (selectedViz === 'themes') {
    baseColor = '#F78154';
  } else {
    baseColor = (selectedMapView === 'counties') ? '#6a1b9a' : '#289261';
  }
  return {
    fetchPath: getTimelineCellsFetchPath(state),
    selectedPhotographer,
    timeRange,
    baseColor,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    labelsWidth: dimensions.timelineHeatmap.labelsWidth,
    makeLink: getMakeLinkFunction(state),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
