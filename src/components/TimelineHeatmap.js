import { connect } from 'react-redux';
import TimelineHeatmap from './TimelineHeatmap.jsx';
import { selectPhotographer, clearPhotographer } from '../store/actions';
import { getPhotographers } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedState, selectedCounty, selectedPhotographer, timeRange, dimensions } = state;
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
      p.active = activePhotographers.includes(p.key)
        && timeRange[1] > p.firstDate && timeRange[0] < p.lastDate;
      return p;
    });
  return {
    timelineCells,
    photographers,
    selectedState,
    selectedCounty,
    selectedPhotographer,
    timeRange,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    baseColor: (state.selectedMapView === 'counties') ? '#6a1b9a' : '#289261',
  }
};

const mapDispatchToProps = {
  selectPhotographer,
  clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineHeatmap);
