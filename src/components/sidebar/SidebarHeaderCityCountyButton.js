import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedCountyMetadata } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedCounty, selectedCity } = state;
  let label;
  let link;
  if (selectedCounty) {
    label = `${getSelectedCountyMetadata(state).name},`;
    link = `/state/${selectedState}`;
  } else if (selectedCity) {
    label = `${selectedCity},`;
    link = `/state/${selectedState}#mapview=cities`;
  }

  return {
    label,
    link,
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
