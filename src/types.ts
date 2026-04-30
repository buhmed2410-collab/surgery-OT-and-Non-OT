
export type SurgeryType = 'Major' | 'Minor';

export interface SurgeryRecord {
  id: string;
  year: number;
  month: number;
  type: SurgeryType;
  specialty: string;
  count: number;
  outcome: 'Success' | 'Complication';
  patientAgeGroup: 'Child' | 'Adult' | 'Senior';
}

export type Language = 'ar' | 'en';
export type DesignMode = 'bento' | 'density';

export interface DashboardState {
  language: Language;
  designMode: DesignMode;
  filters: {
    year: string;
    month: string;
    type: string;
  };
}
