import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getMakeLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedTheme, selectedViz } = state;

  const label = (selectedTheme !== 'root')
    ? selectedTheme.substring(selectedTheme.lastIndexOf('|') + 1)
    : null;
  const makeLink = getMakeLinkFunction(state);
  const parentTheme = selectedTheme.substring(0, selectedTheme.lastIndexOf("|"));
  const link = makeLink([{
    type: 'set_theme',
    payload: parentTheme,
  }]);

  return {
    label,
    link,
    className: 'themes',
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
