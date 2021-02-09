import * as React from 'react';
import CloseButton from './buttons/Close';

const MapCitiesInfo = ({close}: {close: React.Dispatch<React.SetStateAction<boolean>>}) => (
  <div id='modalWrapper'>
    <div className='modal'>
      <CloseButton
        onClick={close}
      />
      <p>
        The circles on the map are sized based upon the number of photos take of that place or a subset thereof if a photographer, a theme, a time range, etc. is selected. 
      </p>
      <p>
        Some places are combined if they are in the same state or territory and they are close enough to one another that their circles overlap substantially and obscure each other. For example, several communities near or in the vicinity of Philadelphia—Haverford, Upper Darvy, Chester, and ten other communities—are grouped together in the "Philadelphia" circle. The locations of the photos list more specific locales. 
      </p>
    </div>
  </div>
);

export default MapCitiesInfo;
