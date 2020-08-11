import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import { toggleSearch } from '../store/actions';
import { getBuildLinkFunction } from '../store/selectors';

const mapStateToProps = state =>  {
  const { selectedState, selectedCounty, selectedCity, selectedTheme, selectedMapView, selectedViz } = state;
  
  // build the links
  const buildLink = getBuildLinkFunction(state);
  const themesLink = buildLink({
    viz: 'themes',
    remove: ['photo'],
  });

  let countiesReplaceOrAdd = [{
    param: 'maps',
    value: null,
  }];
  if (selectedCounty) {
    countiesReplaceOrAdd[0].param = 'county';
    countiesReplaceOrAdd[0].value = selectedCounty;
  } else if (selectedState) {
    countiesReplaceOrAdd[0].param = 'state';
    countiesReplaceOrAdd[0].value = selectedState;
  }
  let countiesLink = buildLink({
    viz: (selectedViz === 'photographer' || selectedViz: 'themes')  ? 'maps' : undefined,
    replaceOrAdd: countiesReplaceOrAdd,
    remove: ['city'],
    replace: (selectedCity) ? [{
      param: 'city',
      withParam: 'state',
      value: selectedState,
    }] : [],
  });

  let citiesReplaceOrAdd = [{
    param: 'maps',
    value: null,
  }];
  if (selectedCity) {
    citiesReplaceOrAdd[0].param = 'city';
    citiesReplaceOrAdd[0].value = selectedCity;
  } else if (selectedState) {
    citiesReplaceOrAdd[0].param = 'state';
    citiesReplaceOrAdd[0].value = selectedState;
  }
  let citiesLink = buildLink({
    viz: (selectedViz === 'photographer' || selectedViz: 'themes') ? 'maps' : undefined,
    replaceOrAdd: citiesReplaceOrAdd,
    remove: ['county'],
    replace: (selectedCounty) ? [{
      param: 'county',
      withParam: 'state',
      value: selectedState,
    }] : [],
    hash: '#mapview=cities',
  });


  return {
    selectedViz: state.selectedViz,
    selectedMapView: state.selectedMapView,
    selectedCity: state.selectedCity,
    selectedCounty: state.selectedCounty,
    selectedState: state.selectedState,
    isMobile: state.dimensions.isMobile,
    themesLink,
    countiesLink,
    citiesLink,
    buildLink: getBuildLinkFunction(state),
  };
};

const mapDispatchToProps = {
  toggleSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
