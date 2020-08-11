import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedStateName, getBuildLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedMapView, selectedCounty, selectedCity } = state;
  const label = (selectedCounty || selectedCity) ? selectedState : getSelectedStateName(state);
  const link = (selectedMapView === 'cities') ? '/#mapview=cities' : '/';
  return {
    label,
    link,
    removeFromLink: ['state', 'county'],
    buildLink: getBuildLinkFunction(state),
    className: selectedMapView,
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
