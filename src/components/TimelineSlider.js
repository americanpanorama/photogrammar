import { connect } from 'react-redux';
import TimelineSlider from './TimelineSlider.jsx';
import { setTimeRange } from '../store/actions';

const mapStateToProps = state => ({
  timeRange: state.timeRange,
  width: state.dimensions.timelineHeatmap.width,
  leftAxisWidth: state.dimensions.timelineHeatmap.leftAxisWidth,
});

const mapDispatchToProps = {
  setTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSlider);
