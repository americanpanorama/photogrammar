import { connect } from 'react-redux';
import FetchSidebarPhotos from './FetchSidebarPhotos.jsx';
import { getSidebarPhotosQuery } from '../../store/selectors';

const mapStateToProps = state => ({
  query: getSidebarPhotosQuery(state),
});

export default connect(mapStateToProps, {})(FetchSidebarPhotos);
