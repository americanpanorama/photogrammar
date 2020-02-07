// const { hash } = window.location;
// hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
//   const [key, value] = pair.split('=');
// });

export default {
  selectedPhotographer: null,
  selectedCounty: null,
  selectedState: null,
  sidebarPhotos: [],
  sidebarPhotosOffset: 0,
  sidebarPhotosCount: 300,
  countiesData: [],
  selectedPhotoData: null,
  mapPosition: {
    x: 0,
    y: 0,
    z: 1,
  },
  randomPhotoNumbers: [],
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
