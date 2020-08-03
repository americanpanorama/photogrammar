import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.js';
import { clearFilterTerms } from '../../store/actions';

const mapStateToProps = state => ({
  label: (state.filterTerms.length > 0) ? `"${state.filterTerms.join(' ')}"` : null,
});

const mapDispatchToProps = {
  onClick: clearFilterTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
