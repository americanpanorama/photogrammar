import { connect } from 'react-redux';
import SidebarPhotos from './SidebarPhotos.jsx';

const mapStateToProps = state => ({
  photos: state.sidebarPhotos,
  selectedPhotoCallNumber: (state.selectedPhotoData && state.selectedPhotoData.call_number)
    ? state.selectedPhotoData.call_number : null,
});


export default connect(mapStateToProps)(SidebarPhotos);
