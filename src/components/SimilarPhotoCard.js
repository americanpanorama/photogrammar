import { connect } from 'react-redux';
import PhotoCard from './PhotoCard.jsx';

const mapStateToProps = state => ({
  selectedPhotograph: (state.selectedPhotoData) ? state.selectedPhotoData.loc_item_link : null,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCard);
