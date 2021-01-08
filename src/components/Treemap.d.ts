import { Theme } from '../index.d';

export interface ThemeStats {
  total: number;
  vanderbilt_level1: string;
  vanderbilt_level2: string;
  vanderbilt_level3: string;
}

export interface DBData {
  rows: ThemeStats[];
}

export interface AsyncData {
  counties?: any;
  cities?: any;
  themes?: Theme;
}
