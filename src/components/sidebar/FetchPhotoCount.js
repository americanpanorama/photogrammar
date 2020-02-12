import { connect } from 'react-redux';
import FetchPhotoCount from './FetchPhotoCount.jsx';
import { getSidebarPhotoCountQuery } from '../../store/selectors';

const mapStateToProps = state => ({
  query: getSidebarPhotoCountQuery(state),
  nationalCount: state.randomPhotoNumbers.length,
});

export default connect(mapStateToProps, {})(FetchPhotoCount);
