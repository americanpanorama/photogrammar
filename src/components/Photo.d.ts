import { MakeLink, MapView } from '../index.d';

export interface Props {
  photoMetadataQuery: string;
  similarPhotosQuery: string;
  selectedMapView: MapView,
  height: number,
  lightboxLink: string,
  makeLink: MakeLink,
}
