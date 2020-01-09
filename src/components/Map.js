import { connect } from 'react-redux';
import Map from './Map.jsx';
import States from '../../public/data/states.json';
import { selectCounty, setXYZFromBounds } from '../store/actions';
import { getCounties } from '../store/selectors';

const mapStateToProps = state => {
  const { mapPosition, dimensions } = state;
  const { mapProjection, map: mapDimensions } = dimensions;
  const { x, y, z } = mapPosition;
  const offsetX = (mapProjection.width * z * x - mapDimensions.width / 2) * -1;
  return {
    counties: getCounties(state),
    states: States.features,
    mapPosition: mapPosition,
    scale: z,
    offsetX,
    translateX: x,
    translateY: y,
    transform: `translate(${mapProjection.width / 2} 0}) scale(${mapDimensions.scale * z})`,
    //transform: `scale(${mapDimensions.scale * z})`,
    dimensions: state.dimensions,
  };
}

const mapDispatchToProps = {
  selectCounty,
  setXYZFromBounds,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
