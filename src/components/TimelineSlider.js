import { connect } from 'react-redux';
import TimelineSlider from './TimelineSlider.jsx';
import { setTimeRange } from '../store/actions';
import { getBuildLinkFunction } from '../store/selectors';

const mapStateToProps = state => ({
  timeRange: state.timeRange,
  width: state.dimensions.timelineHeatmap.width,
  leftAxisWidth: state.dimensions.timelineHeatmap.leftAxisWidth,
  buildLink: getBuildLinkFunction(state),
});

const mapDispatchToProps = {
  setTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSlider);
