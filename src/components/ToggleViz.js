import { connect } from 'react-redux';
import ToggleViz from './ToggleViz.jsx';
import { toggleViz } from '../store/actions';

const mapStateToProps = state => ({
  vizOpen: state.vizOpen,
  selectedViz: state.selectedViz,
});

const mapDispatchToProps = {
  toggleViz,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToggleViz);
