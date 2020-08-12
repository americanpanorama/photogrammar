import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedStateName, getMakeLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedMapView, selectedCounty, selectedCity } = state;
  let label;
  if (selectedCounty || selectedCity) {
    label = selectedState;
  } else if (selectedState) {
    label = getSelectedStateName(state);
  }
  const makeLink = getMakeLinkFunction(state);
  const link = makeLink([{ type: 'clear_state'}]);
  return {
    label,
    link,
    className: selectedMapView,
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
