import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.js';
import { getSelectedCountyMetadata, getMakeLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedCounty, selectedCity, selectedMapView } = state;
  let label;
  if (selectedCounty) {
    label = `${getSelectedCountyMetadata(state).name}`;
  } else if (selectedCity) {
    label = `${selectedCity.substring(3)}`;
  }
  const makeLink = getMakeLinkFunction(state);
  const link = makeLink([{ type: 'clear_county', type: 'clear_city' }]);

  return {
    label,
    link,
    className: selectedMapView,
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
