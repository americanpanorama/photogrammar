import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { getBuildLinkFunction } from '../../store/selectors';

const mapStateToProps = state => ({
  buildLink: getBuildLinkFunction(state),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
