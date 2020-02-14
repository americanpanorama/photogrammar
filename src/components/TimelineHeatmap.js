import { connect } from 'react-redux';
import TimelineHeatmap from './TimelineHeatmap.jsx';
import { selectPhotographer } from '../store/actions';
import { getPhotographers } from '../store/selectors';

const mapStateToProps = state => {
  const timelineCells = state.timelineCells.filter(tc => tc.year < 1944 || tc.month <= 6);
  const activePhotographers = timelineCells.map(tc => tc.photographer);
  const photographers = getPhotographers()
    .filter(p => p.key !== 'unspecified')
    .sort((a, b) => {
      if (a.firstDate > b.firstDate) {
        return 1;
    }
      if (a.firstDate < b.firstDate) {
        return -1;
      }
      if (a.lastDate > b.lastDate) {
        return 1;
      }
      if (a.lastDate < b.lastDate) {
        return -1;
      }
      return 0;
    })
    .map(p => {
      p.active = activePhotographers.includes(p.key);
      return p;
    });
  return {
    timelineCells,
    photographers,
    selectedState: state.selectedState,
    selectedCounty: state.selectedCounty,
    width: state.dimensions.timelineHeatmap.width,
    height: photographers.length * 15,
    leftAxisWidth: state.dimensions.timelineHeatmap.leftAxisWidth,
  }
};

const mapDispatchToProps = {
  selectPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineHeatmap);
