import { connect } from 'react-redux';
import Photographer from './Photographer.jsx';
import { getSelectedPhotographerMetadata } from '../store/selectors';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: getSelectedPhotographerMetadata(state),
    expandedSidebar: state.expandedSidebar,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographer);
