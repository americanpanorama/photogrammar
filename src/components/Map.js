import { connect } from 'react-redux';
import Map from './Map.jsx';
import States from '../../public/data/states.json';
import { setXYZ, selectCounty } from '../store/actions';
import { getCounties } from '../store/selectors';

const mapStateToProps = state => {
  const { mapPosition, dimensions } = state;
  const { x, y, z } = mapPosition;
  return {
    counties: getCounties(state),
    states: States.features,
    selectedCounty: state.selectedCounty,
    scale: z,
    translateX: x,
    translateY: y,
    mapDimensions: dimensions.map,
  };
}

const mapDispatchToProps = {
  setXYZ,
  selectCounty,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
