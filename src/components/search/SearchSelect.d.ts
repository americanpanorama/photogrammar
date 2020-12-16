import { Option } from '../Search.d';

export interface Props {
  label: string;
  defaultValue: Option;
  onChange: any;
  fetchPath:string;
  allOptions:Option[];
  altFilterFunction?: any;
}
