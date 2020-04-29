import { connect } from 'react-redux';
import FetchPhotoCount from './FetchPhotoCount.jsx';
import { getSidebarPhotoCountQuery } from '../../store/selectors';
import { clearFilterTerms } from '../../store/actions';

const mapStateToProps = state => ({
  query: getSidebarPhotoCountQuery(state),
  nationalCount: state.randomPhotoNumbers.length,
  filterTerms: state.filterTerms,
});

const mapDispatchToProps = {
  clearFilterTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(FetchPhotoCount);
