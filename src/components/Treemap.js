import { connect } from 'react-redux';
import Treemap from './Treemap.jsx';
import { selectTheme } from '../store/actions';
import { getThemes } from '../store/selectors';

const mapStateToProps = state => {
  const { themes, query, ancestors } = getThemes(state);
  return {
    themes,
    query,
    ancestors,
    selectedTheme: state.selectedTheme,
    height: state.dimensions.map.height,
    width: state.dimensions.map.width,
  };
};

const mapDispatchToProps = {
  selectTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
