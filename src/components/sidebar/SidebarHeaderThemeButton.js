import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getBuildLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const { selectedTheme, selectedViz } = state;

  const label = (selectedViz === 'themes' && selectedTheme !== 'root')
    ? selectedTheme.substring(selectedTheme.lastIndexOf('|') + 1)
    : null;
  const link = `/themes/${selectedTheme.substring(0, selectedTheme.lastIndexOf('|'))}`;

  return {
    label,
    replaceInLink: [{
      param: 'themes',
      value: selectedTheme.substring(0, selectedTheme.lastIndexOf('|')),
    }],
    buildLink: getBuildLinkFunction(state),
  };
};

export default connect(mapStateToProps, {})(SidebarHeaderFacetButton);
