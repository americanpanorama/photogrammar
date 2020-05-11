import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getDateRangeString } from '../../store/selectors';
import { setTimeRange } from '../../store/actions';

const mapStateToProps = state => ({
  label: getDateRangeString(state),
  disabled: state.timeRange[0] === 193501 && state.timeRange[1] === 194406,
});

const mapDispatchToProps = {
  onClick: setTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
