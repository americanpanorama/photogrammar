import { connect } from 'react-redux';
import FetchSidebarPhotos from './FetchSidebarPhotos.jsx';
import { getSidebarPhotosQuery, getStateAbbr } from '../../store/selectors';

const mapStateToProps = state => ({
  query: getSidebarPhotosQuery(state),
  getStateAbbr,
});

export default connect(mapStateToProps, {})(FetchSidebarPhotos);
