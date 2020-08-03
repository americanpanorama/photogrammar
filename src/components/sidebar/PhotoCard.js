import { connect } from 'react-redux';
import PhotoCard from './PhotoCard.jsx';
import { getBuildLinkFunction } from '../../store/selectors';


const mapStateToProps = state => {
  const { selectedMapView, dimensions } = state;
  const { width, height, interiorWidth, interiorHeight, padding, margin, borderWidth } = dimensions.photoCards;

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
    buildLink: getBuildLinkFunction(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCard);
