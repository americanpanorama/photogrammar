import { connect } from 'react-redux';
import Photo from './Photo.jsx';
import { toggleLightbox, selectPhoto } from '../store/actions';
import { getCentroidForCounty} from '../store/selectors';

const mapStateToProps = state => {
  const photoMetadata = state.selectedPhotoData;
  const centroid = (photoMetadata) ? getCentroidForCounty(photoMetadata.nhgis_join) : null;
  const photographerKey = (photoMetadata && photoMetadata.photographer_name) ? photoMetadata.photographer_name.replace(/[\s\.]/g, '') : null;
  return {
    photoMetadata,
    photographerKey,
    centroid,
    height: state.dimensions.selectedPhoto.height,
    selectedMapView: state.selectedMapView,
  };
};

const mapDispatchToProps = {
  selectPhoto,
  toggleLightbox,
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
