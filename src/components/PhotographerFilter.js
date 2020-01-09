import { connect } from 'react-redux';
import PhotographerFilter from './PhotographerFilter.jsx';
import { selectPhotographer } from '../store/actions';

import Photographers from '../../public/data/photographers.json';

const mapStateToProps = state => ({
  photographers: Photographers,
  selectedPhotographer: state.selectedPhotographer,
});

const mapDispatchToProps = {
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotographerFilter);
