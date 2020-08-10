let selectedMapView = 'counties';

const { hash } = window.location;
hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
  const [key, value] = pair.split('=');
  if (key === 'mapview') {
    selectedMapView = 'cities';
  }
});

export default {
  isInitialized: false,
  hasCompletedFirstLoad: false,
  selectedPhotographer: null,
  selectedCounty: null,
  selectedCity: null,
  selectedState: null,
  selectedMapView,
  selectedViz: 'map',
  selectedTheme: 'root',
  sidebarPhotosOffset: 0,
  selectedPhoto: null,
  timeRange: [193501, 194406],
  isWelcomeOpen: false,
  pathname: '/maps',
  hash: null,
  dimensions: {
    calculated: false,
    vizCanvas: {
      height: '90%',
      width: '60%',
    },
    sidebar: {
      width: 200,
      height: 600,
      headerHeight: 70,
      photosHeight: 530,
    },
    map: {
      height: 500,
      width: 960,
      scale: 1,
    },
    mapProjection: {
      height: '100%',
      width: '100%'
    },
    photoCards: {
      displayableCards: 6,
    },
    timelineHeatmap: {
      height: 250,
      width: 960,
      leftAxisWidth: 120,
    },
  },
  filterTerms: [],
  expandedSidebar: false,
  searchOpen: false,
  vizOpen: true,
};
