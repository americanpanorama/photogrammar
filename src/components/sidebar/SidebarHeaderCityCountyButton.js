import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.js';
import { getSelectedCountyMetadata } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedCounty, selectedCity, selectedMapView } = state;
  let label;
  let link;
  let replaceInLink;
  if (selectedCounty) {
    label = `${getSelectedCountyMetadata(state).name},`;
    replaceInLink = [{
      param: 'county',
      withParam: 'state',
      value: selectedState,
    }];
  } else if (selectedCity) {
    label = `${selectedCity},`;
    replaceInLink = [{
      param: 'city',
      withParam: 'state',
      value: selectedState,
    }];
  }

  return {
    label,
    link,
    replaceInLink,
    className: selectedMapView,
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
