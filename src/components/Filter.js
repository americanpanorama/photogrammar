
import { connect } from 'react-redux';
import Filter from './Filter.jsx';
import { setFilterTerms, clearFilterTerms } from '../store/actions';

const mapStateToProps = state => ({
    terms: state.filterTerms,
});

const mapDispatchToProps = {
    setFilterTerms,
    clearFilterTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
