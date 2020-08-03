import { connect } from 'react-redux';
import Photo from './Photo.jsx';
import { toggleLightbox } from '../store/actions';
import { getPhotoFetchQueries, getBuildLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { photoMetadataQuery, similarPhotosQuery } = getPhotoFetchQueries(state);
  return {
    photoMetadataQuery,
    similarPhotosQuery,
    selectedMapView: state.selectedMapView,
    height: state.dimensions.selectedPhoto.height,
    buildLink: getBuildLinkFunction(state),
  };
};

const mapDispatchToProps = {
  toggleLightbox,
};

export default connect(mapStateToProps, mapDispatchToProps)(Photo);
