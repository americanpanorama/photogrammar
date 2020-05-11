import { connect } from 'react-redux';
import Photographers from './Photographers.jsx';
import { getPhotographers } from '../store/selectors';

const mapStateToProps = state => {
  const photographers = getPhotographers(0)
    .filter(p => p.img)
    .sort((a, b) => {
      if (a.lastname < b.lastname) {
        return -1;
      }
      if (a.lastname > b.lastname) {
        return 1;
      }
      if (a.firstname < b.firstname) {
        return -1;
      }
      if (a.firstname > b.firstname) {
        return 1;
      }
      return 0;
    });
  return {
    photographers,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographers);
