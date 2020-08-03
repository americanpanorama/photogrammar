import { connect } from 'react-redux';
import FetchSidebarPhotos from './FetchSidebarPhotos.jsx';
import { getSidebarPhotosQuery, cartoURLBase, getStateAbbr } from '../../store/selectors';

const mapStateToProps = state => ({
  cartoURLBase,
  query: getSidebarPhotosQuery(state),
  getStateAbbr,
});

export default connect(mapStateToProps, {})(FetchSidebarPhotos);
