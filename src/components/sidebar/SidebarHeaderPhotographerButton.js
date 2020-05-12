
import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedPhotographerName } from '../../store/selectors';
import { clearPhotographer } from '../../store/actions';

const mapStateToProps = state => ({
  label: getSelectedPhotographerName(state),
  disabled: state.selectedViz === 'photographers',
});

const mapDispatchToProps = {
  onClick: clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);