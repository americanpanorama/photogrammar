import { connect } from 'react-redux';
import Photo from './Photo.jsx';
import { selectPhotographer, selectPhoto } from '../store/actions';
import { getCentroidForCounty } from '../store/selectors';

const mapStateToProps = state => {
  const photoMetadata = state.selectedPhotoData;
  const centroid = (photoMetadata) ? getCentroidForCounty(photoMetadata.nhgis_join) : null;
  return {
    photoMetadata,
    centroid,
  }
};

const mapDispatchToProps = {
  selectPhoto,
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
