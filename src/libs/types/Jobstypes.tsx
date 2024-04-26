export type Jobsprops = {
  id: number;
  title: string;
  location?: string | null;
  salary: number;
  companyName?: string | null;
  jobType?: string | null;
  employer?: string | null;
}