import { connect } from 'react-redux';
import Search from './Search.jsx';
import Themes from '../../data/themes.json';
import { search, toggleSearch } from '../store/actions';
import { getPhotographers, getStateSearchOptions, getCountiesOrCitiesOptions, getThemesSearchOptions } from '../store/selectors';

const mapStateToProps = state => {
  const countiesOrCitiesOptions = getCountiesOrCitiesOptions(state);

  const selectedPhotographerOption = (state.selectedPhotographer)
    ? getPhotographers()
      .filter(d => d.key === state.selectedPhotographer)
      .map(p => ({
        value: p.key,
        label: `${p.firstname} ${p.lastname}`.trim(),
      }))
    : null;

  const selectedStateOption = (state.selectedState)
    ? getStateSearchOptions().find(d => d.value === state.selectedState) : null;

  const selectedThemeOption = (state.selectedTheme)
    ? Themes.find(d => d.value === state.selectedTheme) : null;

  const selectedCountyOption = (state.selectedCounty)
    ? countiesOrCitiesOptions.counties[state.selectedState].find(d => d.value === state.selectedCounty) : null;

  return {
    selectedPhotographerOption,
    selectedStateOption,
    selectedThemeOption,
    selectedCountyOption,
    selectedCity: state.selectedCity,
    terms: state.filterTerms,
    selectedMapView: state.selectedMapView,
    countiesOrCitiesOptions,
    cities: [],
    timeRange: state.timeRange,
    caption: '',
  };
};

const mapDispatchToProps = {
  search,
  toggleSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
