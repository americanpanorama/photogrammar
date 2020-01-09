import { connect } from 'react-redux';
import Photo from './Photo.jsx';
import { selectPhotographer, selectPhoto } from '../store/actions';

const mapStateToProps = state => ({
  photoMetadata: state.selectedPhotoData,
});

const mapDispatchToProps = {
  selectPhoto,
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
