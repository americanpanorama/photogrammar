import { connect } from 'react-redux';
import ActionsFromURL from './ActionsFromURL';
import { setState } from '../store/actions';

const mapStateToProps = state => ({
  isLoading: state.isLoading,
});

const mapDispatchToProps = {
  setState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionsFromURL);
