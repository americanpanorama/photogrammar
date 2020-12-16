import { MapView, Viz } from '../index.d';

export interface Props {
  countiesLink: string;
  citiesLink: string;
  themesLink: string;
  selectedViz: Viz;
  selectedMapView: MapView;
  toggleSearch: () => void;
  isMobile: boolean;
}
