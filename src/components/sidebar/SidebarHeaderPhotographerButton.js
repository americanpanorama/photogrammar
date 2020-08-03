import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedPhotographerName, getBuildLinkFunction } from '../../store/selectors';

const mapStateToProps = state => ({
  label: getSelectedPhotographerName(state),
  disabled: state.selectedViz === 'photographers',
  removeFromLink: ['photographers'],
  buildLink: getBuildLinkFunction(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
