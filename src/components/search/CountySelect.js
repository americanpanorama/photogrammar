import { connect } from 'react-redux';
import CountySelect from './CountySelect.jsx';
import { getCountiesOrCitiesOptions } from '../../store/selectors';

const mapStateToProps = state => {
  return {
    counties: getCountiesOrCitiesOptions(state),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CountySelect);
