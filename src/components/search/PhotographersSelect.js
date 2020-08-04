import { connect } from 'react-redux';
import SearchSelect from './SearchSelect.jsx';
import { getPhotographers } from '../../store/selectors';

const mapStateToProps = state => {
  const photographersOptions = getPhotographers()
    .sort((a, b) => {
      if (b.lastname > a.lastname) {
        return -1;
      }
      if (b.lastname < a.lastname) {
        return 1;
      }
      if (b.firstname > a.firstname) {
        return -1;
      }
      if (b.firstname < a.firstname) {
        return 1;
      }
      return 0;
    })
    .map(p => ({
      value: p.key,
      label: `${p.firstname} ${p.lastname}`.trim(),
    }));

  return {
    allOptions: photographersOptions,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSelect);
