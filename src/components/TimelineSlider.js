import { connect } from 'react-redux';
import TimelineSlider from './TimelineSlider';
import { setTimeRange } from '../store/actions';
import { getMakeLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { timeRange, dimensions } = state;
  const { width: timelineWidth, leftAxisWidth, labelsWidth } = dimensions.timelineHeatmap;

  return {
    timeRange,
    width: timelineWidth - labelsWidth,
    marginLeft: leftAxisWidth + labelsWidth,
    makeLink: getMakeLinkFunction(state),
  }
};

const mapDispatchToProps = {
  setTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSlider);
