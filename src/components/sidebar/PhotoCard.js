import { connect } from 'react-redux';
import PhotoCard from './PhotoCard.jsx';

const mapStateToProps = state => {
  const { selectedMapView, dimensions } = state;
  const { width, height, interiorWidth, interiorHeight, padding, margin, borderWidth, scale } = dimensions.photoCards;

  return {
    selectedPhotograph: (state.selectedPhotoData) ? state.selectedPhotoData.loc_item_link : null,
    width,
    height,
    interiorWidth,
    interiorHeight,
    padding,
    margin,
    borderWidth,
    selectedMapView,
    scale,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCard);
