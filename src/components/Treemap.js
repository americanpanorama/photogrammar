import { connect } from 'react-redux';
import Treemap from './Treemap.jsx';
import { getThemesFetchPath, getThemesBackgroundPhotosQuery, getMakeLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedTheme, timeRange, filterTerms, dimensions } = state;
  const { height, width } = dimensions.map;
  return {
    fetchPath: getThemesFetchPath(state),
    photosQuery: getThemesBackgroundPhotosQuery(state),
    timeRange,
    filterTerms,
    selectedTheme,
    height,
    width,
    dimensions,
    makeLink: getMakeLinkFunction(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
