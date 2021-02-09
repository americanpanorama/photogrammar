import * as React from 'react';
import CloseButton from './buttons/Close';

const MapCitiesInfo = ({close}: {close: React.Dispatch<React.SetStateAction<boolean>>}) => (
  <div id='modalWrapper'>
    <div className='modal'>
      <CloseButton
        onClick={close}
      />
      <p>
        The counties map is a choropleth map where the number of photos is divided by the area of the county (or parish or municipality) to calculate the color. Essentially, the color represents photos per square mile. So if a small county and a large county have the same number of photos, the former will have a deeper purple color than the latter.
      </p>
    </div>
  </div>
);

export default MapCitiesInfo;
