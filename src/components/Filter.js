import { connect } from 'react-redux';
import Filter from './Filter.jsx';
import { setFilterTerms, clearFilterTerms, toggleSearch } from '../store/actions';

const mapStateToProps = state => ({
  terms: state.filterTerms,
});

const mapDispatchToProps = {
  setFilterTerms,
  clearFilterTerms,
  toggleSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
