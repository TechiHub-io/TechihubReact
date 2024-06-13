export type Jobsprops = {
  id: number;
  title: string;
  location?: string | null;
  salary: number;
  companyName?: string | null;
  jobType?: string | null;
  employer?: string | null;
}

export interface City {
  name: string;
  country: string;
}

export interface OptionType {
  label: string;
  value: string;
}

export interface FilterProps {
  dispatch: React.Dispatch<any>;
}

export interface Jobsd {
  id: string;
  title: string;
  location: string;
  salary: string;
  companyName: string;
  jobType: string;
  employer: string;
}

export interface JobsProps {
  filters: {
    jobType?: string;
    location?: string;
  };
}

export interface JobComponentProps {
  id: string;
  title: string;
  location: string;
  salary: string;
  companyName: string;
  jobType: string;
  employer: string;
}

export interface State {
  jobType: string;
  location: string;
  // level?: string;
  // experience?: string;
}

export interface Action {
  type: 'SET_JOBTYPE' | 'SET_LOCATION';
  payload: string;
}