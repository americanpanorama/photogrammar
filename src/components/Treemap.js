import { connect } from 'react-redux';
import Treemap from './Treemap.jsx';
import { selectTheme, selectViz } from '../store/actions';
import { getThemes } from '../store/selectors';

const mapStateToProps = state => {
  const { themes, name, query, ancestors } = getThemes(state);
  return {
    themes: themes.reverse(),
    name,
    query,
    ancestors,
    selectedTheme: state.selectedTheme,
    selectedViz: state.selectedViz,
    height: state.dimensions.map.height,
    width: state.dimensions.map.width,
  };
};

const mapDispatchToProps = {
  selectTheme,
  selectViz,
};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
