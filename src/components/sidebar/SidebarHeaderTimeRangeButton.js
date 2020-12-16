import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton';
import { getDateRangeString, getMakeLinkFunction } from '../../store/selectors';
import { setTimeRange } from '../../store/actions';

const mapStateToProps = state => {
  const makeLink = getMakeLinkFunction(state);
  const link = makeLink([{ type: 'clear_time_range' }]);
  return {
    label: getDateRangeString(state),
    link,
    disabled: state.timeRange[0] === 193501 && state.timeRange[1] === 194406,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
