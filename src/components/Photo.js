import { connect } from 'react-redux';
import Photo from './Photo.jsx';
import { selectPhotographer, selectPhoto } from '../store/actions';
import { getCentroidForCounty, getVizLink } from '../store/selectors';

const mapStateToProps = state => {
  const photoMetadata = state.selectedPhotoData;
  const centroid = (photoMetadata) ? getCentroidForCounty(photoMetadata.nhgis_join) : null;
  const photographerKey = (photoMetadata && photoMetadata.photographer_name) ? photoMetadata.photographer_name.replace(/[\s\.]/g, '') : null;
  return {
    photoMetadata,
    photographerKey,
    centroid,
    vizLink: getVizLink(state),
    height: state.dimensions.selectedPhoto.height,
    selectedMapView: state.selectedMapView,
  };
};

const mapDispatchToProps = {
  selectPhoto,
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
