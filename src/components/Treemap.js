import { connect } from 'react-redux';
import Treemap from './Treemap.jsx';
import { selectTheme } from '../store/actions';
import { getThemes } from '../store/selectors';

const mapStateToProps = state => {
  const { themes, name, query, ancestors } = getThemes(state);
  const { selectedTheme, dimensions } = state;
  const { height, width } = dimensions.map;
  return {
    themes: themes.reverse(),
    name,
    query,
    ancestors,
    selectedTheme,
    height,
    width,
  };
};

const mapDispatchToProps = {
  selectTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
