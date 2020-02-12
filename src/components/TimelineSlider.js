import { connect } from 'react-redux';
import TimelineSlider from './TimelineSlider.jsx';
import { setTimeRange } from '../store/actions';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  setTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSlider);
