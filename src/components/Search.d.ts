import { CityKey, NHGISJoinCode, StateAbbr, MapView } from '../index.d';

export interface Option {
  label: string;
  value: string;
  sublabels?: string[];
}

export interface Props {
  selectedPhotographerOption: Option | null;
  selectedStateOption: Option;
  selectedThemeOption: Option | null;
  selectedCountyOption: Option;
  selectedCityOption: Option;
  selectedPhotoCaption: Option;
  terms: string[];
  timeRange: [number, number];
  selectedMapView: MapView;
  countiesOrCitiesOptions: {
    cities: any;
    counties: {
      [stateAbbr: string]: Option[];
    }; 
  };
  toggleSearch: () => void;
}

export type Field = 'photographer_name' | 'state' | 'nhgis_join' | 'city' | 'themes' | 'count';

export interface Cities {
  city: CityKey;
}

export interface DBCities {
  rows: Cities[];
}

export interface DBQueryResult {
  field: string;
}
