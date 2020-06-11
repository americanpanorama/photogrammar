import { connect } from 'react-redux';
import ActionsFromURL from './ActionsFromURL.jsx';
import { selectViz, selectPhoto, selectMapView, selectTheme, selectNation, selectState, selectCounty, selectCity, selectPhotographer, clearPhotographer } from '../store/actions';

const mapStateToProps = state => ({
  selectedViz: state.selectedViz,
  selectedMapView: state.selectedMapView,
  selectedTheme: state.selectedTheme,
  selectedPhotoData: state.selectedPhotoData,
  selectedState: state.selectedState,
  selectedCounty: state.selectedCounty,
  selectedCity: state.selectedCity,
  selectedPhotographer: state.selectedPhotographer,
});

const mapDispatchToProps = {
  selectViz,
  selectMapView,
  selectPhoto,
  selectTheme,
  selectNation,
  selectState,
  selectCounty,
  selectCity,
  selectPhotographer,
  clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsFromURL);
