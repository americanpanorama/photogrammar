import { connect } from 'react-redux';
import Steamgraph from './Steamgraph.jsx';
import { selectPhotographer } from '../store/actions';

import SteamgraphPaths from '../../public/data/steamgraphPaths.json';
import Photographers from '../../public/data/photographers.json';

const mapStateToProps = state => ({
  selectedPhotographer: state.selectedPhotographer,
  paths: SteamgraphPaths.map(sp => ({
    ...sp,
    fill: Photographers.find(p => sp.photographerKey === p.key).color,
  })),
  width: state.dimensions.steamgraph.width,
  height: state.dimensions.steamgraph.height,
});

const mapDispatchToProps = {
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Steamgraph);
