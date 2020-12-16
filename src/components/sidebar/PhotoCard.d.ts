import { PhotoMetadata, MapView, MakeLink } from '../../index.d';

export interface Props {
  photo: PhotoMetadata;
  selectedPhotograph: string;
  width: number;
  height: number;
  interiorWidth: number;
  interiorHeight: number;
  margin: number;
  padding: number;
  borderWidth: number;
  scale: number;
  selectedMapView: MapView;
  makeLink: MakeLink;
}
