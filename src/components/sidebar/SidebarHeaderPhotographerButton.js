import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedPhotographerName } from '../../store/selectors';

const mapStateToProps = state => ({
  label: getSelectedPhotographerName(state),
  disabled: state.selectedViz === 'photographers',
  removeFromLink: ['photographers'],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
