import { connect } from 'react-redux';
import Search from './Search.jsx';
import { search, toggleSearch } from '../store/actions';
import { getPhotographers, getStateSearchOptions, getCountiesOrCitiesOptions, getThemesSearchOptions } from '../store/selectors';

const mapStateToProps = state => {
  const photographersOptions = getPhotographers()
    .sort((a, b) => {
      if (b.lastname > a.lastname) {
        return -1;
      }
      if (b.lastname < a.lastname) {
        return 1;
      }
      if (b.firstname > a.firstname) {
        return -1;
      }
      if (b.firstname < a.firstname) {
        return 1;
      }
      return 0;
    })
    .map(p => ({
      value: p.key,
      label: `${p.firstname} ${p.lastname}`.trim(),
    }));

  return {
    selectedPhotographer: state.selectedPhotographer,
    selectedCounty: state.selectedCounty,
    selectedCity: state.selectedCity,
    selectedState: state.selectedState,
    selectedTheme: state.selectedTheme,
    terms: state.filterTerms,
    selectedMapView: state.selectedMapView,
    photographers: photographersOptions,
    states: getStateSearchOptions(),
    countiesOrCities: getCountiesOrCitiesOptions(state),
    themes: getThemesSearchOptions(state),
    cities: [],
    timeRange: state.timeRange,
    caption: '',
    open: state.searchOpen,
  };
};

const mapDispatchToProps = {
  search,
  toggleSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
