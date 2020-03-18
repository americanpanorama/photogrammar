import { connect } from 'react-redux';
import PhotoCard from './PhotoCard.jsx';

const mapStateToProps = state => {
  const { width, interiorWidth, padding, margin, borderWidth } = state.dimensions.photoCards;
  return {
    selectedPhotograph: (state.selectedPhotoData) ? state.selectedPhotoData.loc_item_link : null,
    width,
    interiorWidth,
    padding,
    margin,
    borderWidth,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCard);
