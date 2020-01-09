import { connect } from 'react-redux';
import App from './App.jsx';
import { initializeData } from './store/actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  initializeData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
