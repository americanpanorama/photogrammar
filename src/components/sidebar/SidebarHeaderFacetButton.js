
import { connect } from 'react-redux';
import SidebarHeaderFacetButton from './SidebarHeaderFacetButton.jsx';
import { onClick } from '../store/actions';

const mapStateToProps = state => ({
    label: ,
    link: ,
});

const mapDispatchToProps = {
    onClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderFacetButton);
