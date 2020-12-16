import { connect } from 'react-redux';
import SearchSelect from './SearchSelect';
import { getStateSearchOptions } from '../../store/selectors';

const mapStateToProps = state => {
  return {
    allOptions: getStateSearchOptions(),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSelect);
