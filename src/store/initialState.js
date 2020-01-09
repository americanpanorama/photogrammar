import sidebarPhotos from '../../public/data/randomSelections/1-8.json';

// const { hash } = window.location;
// hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
//   const [key, value] = pair.split('=');
// });

export default {
  selectedPhotographer: null,
  selectedCounty: null,
  sidebarPhotos,
  countiesData: [],
  selectedPhotoData: null,
  mapPosition: {
    x: 0,
    y: 0,
    z: 1,
  },
  dimensions: {
    calculated: false,
    vizCanvas: {
      height: '90%',
      width: '60%',
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
  }
};
