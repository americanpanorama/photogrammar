// const { hash } = window.location;
// hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
//   const [key, value] = pair.split('=');
// });

const numsToGenerate = 1000;
const totalRecords = 176212;
const randomPhotoNumbers = [];
while (randomPhotoNumbers.length < numsToGenerate) {
  const rn = Math.floor(Math.random() * totalRecords);
  if (!randomPhotoNumbers.includes(rn)) {
    randomPhotoNumbers.push(rn);
  }
}

export default {
  selectedPhotographer: null,
  selectedCounty: null,
  selectedState: null,
  sidebarPhotosOffset: 0,
  countiesData: [],
  timelineCells: [],
  selectedPhotoData: null,
  timeRange: [193501, 194504],
  mapPosition: {
    x: 0,
    y: 0,
    z: 1,
  },
  randomPhotoNumbers,
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
    photoCards: {
      displayableCards: 6,
    }
  }
};
