import { connect } from 'react-redux';
import Treemap from './Treemap.jsx';
import { getThemesFetchPath, getThemesBackgroundPhotosQuery, getBuildLinkFunction } from '../store/selectors';

const mapStateToProps = state => {
  const { selectedTheme, timeRange, filterTerms, dimensions } = state;
  const { height, width } = dimensions.map;
  return {
    photosQuery: getThemesBackgroundPhotosQuery(state),
    timeRange,
    filterTerms,
    selectedTheme,
    height,
    width,
    dimensions,
    fetchPath: getThemesFetchPath(state),
    buildLink: getBuildLinkFunction(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
