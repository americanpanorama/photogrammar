import { connect } from 'react-redux';
import Lightbox from './Lightbox.tsx';
import { toggleLightbox } from '../store/actions';
import { getPhotoFetchQueries, getMakeLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { photoMetadataQuery } = getPhotoFetchQueries(state);
  const makeLink = getMakeLinkFunction(state);
  const closeLink = state.pathname.replace('/lightbox', '');
  return {
    fetchPath: photoMetadataQuery,
    closeLink,
  };
};

const mapDispatchToProps = {
  toggleLightbox,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
