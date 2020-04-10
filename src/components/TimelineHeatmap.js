import { connect } from 'react-redux';
import TimelineHeatmap from './TimelineHeatmap.jsx';
import { selectPhotographer, clearPhotographer } from '../store/actions';
import { getPhotographers, getTimelineHeatmapRows } from '../store/selectors';

const mapStateToProps = state => {
  const heatmapRows = getTimelineHeatmapRows(state);
  const { selectedState, selectedCounty, selectedPhotographer, timeRange, dimensions } = state;
  const timelineCells = state.timelineCells.filter(tc => tc.year < 1944 || tc.month <= 6);
  const activePhotographers = timelineCells.map(tc => tc.photographer);
  const threshold = 500;
  let photographers = getPhotographers(75)
    .filter(p => p.key !== 'unspecified')
    .sort((a, b) => {
      if (a.count < threshold && b.count >= threshold) {
        return -1;
      }
      if (a.count >= threshold && b.count < threshold) {
        return 1;
      }
      if (a.firstDate > b.firstDate) {
        return (a.count >= 500) ? 1 : -1;
      }
      if (a.firstDate < b.firstDate) {
        return (a.count >= 500) ? -1 : 1;
      }
      if (a.lastDate > b.lastDate) {
        return (a.count >= 500) ? 1 : -1;
      }
      if (a.lastDate < b.lastDate) {
        return (a.count >= 500) ? -1 : 1;
      }
      return 0;
    })
    .map(p => {
      p.active = activePhotographers.includes(p.key)
        && timeRange[1] > p.firstDate && timeRange[0] < p.lastDate;
      return p;
    });

  // insert the "others" data before the first entry with threshold
  photographers.splice(photographers.findIndex(p => p.count >= threshold), 0, {
    key: 'others',
    firstname: '',
    lastname: 'other photographers',
    count: 8000,
    firstDate: 193501,
    lastDate: 194406,
    active: true,
  });



  // use the number above threshold and number below to calculate height and translateY offset
  const numberAboveThreshold = photographers.filter(p => p.count >= threshold).length;
  const numberBelowThreshold = photographers.filter(p => p.count < threshold).length;
  const rowHeight = dimensions.timelineHeatmap.height / numberAboveThreshold;
  const translateY = -1 * rowHeight * numberBelowThreshold;

  return {
    timelineCells,
    photographers,
    selectedState,
    selectedCounty,
    selectedPhotographer,
    timeRange,
    width: dimensions.timelineHeatmap.width,
    height: dimensions.timelineHeatmap.height,
    translateY,
    leftAxisWidth: dimensions.timelineHeatmap.leftAxisWidth,
    baseColor: (state.selectedMapView === 'counties') ? '#6a1b9a' : '#289261',
  }
};

const mapDispatchToProps = {
  selectPhotographer,
  clearPhotographer,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineHeatmap);
