import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getSelectedPhotographerName, getMakeLinkFunction } from '../../store/selectors';

const mapStateToProps = state => {
  const makeLink = getMakeLinkFunction(state);
  const link = makeLink([{ type: 'clear_photographer'} ]);

  return {
    label: getSelectedPhotographerName(state),
    link,
    viz: (state.selectedViz === 'photographers') ? 'photographers' : undefined,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
