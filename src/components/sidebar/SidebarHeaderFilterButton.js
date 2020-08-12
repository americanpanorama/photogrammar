import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.js';
import { clearFilterTerms } from '../../store/actions';
import { getMakeLinkFunction } from '../../store/selectors';


const mapStateToProps = state => {
  const makeLink = getMakeLinkFunction(state);
  const link = makeLink([{ type: 'clear_filter_terms' }]);
  return {
    label: (state.filterTerms.length > 0) ? `"${state.filterTerms.join(' ')}"` : null,
    link,
  }
};

const mapDispatchToProps = {
  onClick: clearFilterTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
