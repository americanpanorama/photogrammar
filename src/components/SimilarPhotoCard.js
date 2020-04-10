import { connect } from 'react-redux';
import SimilarPhotoCard from './SimilarPhotoCard.jsx';

const mapStateToProps = state => ({
  selectedPhotograph: (state.selectedPhotoData) ? state.selectedPhotoData.loc_item_link : null,
  height: state.dimensions.similarPhotos.height,
  width: state.dimensions.similarPhotos.width,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SimilarPhotoCard);
