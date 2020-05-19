
import { connect } from 'react-redux';
import Lightbox from './Lightbox.jsx';
import { toggleLightbox } from '../store/actions';

const mapStateToProps = state => {
  if (!state.lightboxOpen || !state.selectedPhotoData ||
    !state.selectedPhotoData.img_large_path) {
    return {};
  }

  const {
    photographer_name,
    caption,
    year,
    month,
    city,
    county,
    stateAbbr,
    img_large_path: imgPath,
  } = state.selectedPhotoData;

  // make the caption lines
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const captionLines = [];
  if (caption) {
    captionLines.push(`"${caption}"`);
  }
  const linePieces = [];
  if (photographer_name) {
    linePieces.push(photographer_name);
  }
  if (month && year) {
    linePieces.push(`${monthNames[month]}, ${year}`);
  } else if (year) {
    linePieces.push(year);
  }
  if (city && state) {
    linePieces.push(`${city}, ${stateAbbr}`);
  } else if (county && stateAbbr) {
    linePieces.push(`${county}, ${stateAbbr}`);
  } else if (stateAbbr) {
    linePieces.push(stateAbbr);
  }
  if (linePieces.length > 0) {
    captionLines.push(linePieces.join('; '));
  }
      
  return {
    imgPath,
    captionLines,
  };
};

const mapDispatchToProps = {
  toggleLightbox,
};

export default connect(mapStateToProps, mapDispatchToProps)(Lightbox);
