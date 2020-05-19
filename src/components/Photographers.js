import { connect } from 'react-redux';
import Photographers from './Photographers.jsx';
import { getFeaturedPhotographers } from '../store/selectors';

const mapStateToProps = (state) => {
  const photographers = getFeaturedPhotographers()
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
    photographersStaff: photographers.filter(p => p.type === 'staff'),
    photographersNonstaff: photographers.filter(p => p.type === 'nonstaff'),
    fsaStaff: photographers.filter(p => p.type === 'fsa'),
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographers);
