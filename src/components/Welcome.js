import { connect } from 'react-redux';
import Welcome from './Welcome.jsx';
import { closeWelcome } from '../store/actions';

const mapStateToProps = state => ({
  isOpen: state.isWelcomeOpen,
});

const mapDispatchToProps = {
  closeWelcome,
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
