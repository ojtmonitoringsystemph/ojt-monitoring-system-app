export type Explain = {
  hasIssues: boolean;
  explain?: string;
};

export type ReviewOfSystems = {
  chiefComplaint?: string[];
  mental?: Explain;
  respiratory?: Explain;
  gi?: Explain;
  urinary?: Explain;
  endocrine?: Explain;
  genital?: Explain;
  musculoskeletal?: Explain;
};

type SocialHistory = {
  isSmoker: boolean;
  cigarettePkgNo: number;
  isDrinker: boolean;
  bottlesNo: number;
  isIllicitDrugUser: boolean;
  isSexuallyActive: boolean;
  status: ReportStatus;
  remarks: Remarks;
};

export type DiseaseHistory = {
  diseaseCode: string;
  description?: string;
  surgicalDate: Date;
  status: ReportStatus;
  remarks: Remarks;
  tag: PhysicalExamStatus;
};

export type Remarks = {
  value: string;
  type: "default" | "advice" | "deficiency" | "other";
};

export enum PhysicalExamStatus {
  initial = "initial",
  specific = "specific",
}

type MenstrualHistory = {
  menarchePeriod: number;
  lastMensPeriod: Date;
  durationPeriod: number;
  mensInterval: number;
  padsPerday: number;
  onSetSexIc: number;
  birthControlMethod: string;
  isMenopause: boolean;
  menopauseAge: number;
  isApplicable: boolean;
  status: ReportStatus;
  remarks: Remarks;
};

type DeliveryType = "normal" | "operative" | "both" | "not_applicable";

export type ReportStatus = "validated" | "unvalidated";

type PregnancyHistory = {
  pregnancyCount: number;
  deliveryCount: number;
  deliveryType: DeliveryType;
  fullTermCount: number;
  prematureCount: number;
  abortionCount: number;
  liveChildrenCount: number;
  withPregIndhyp: boolean;
  withFamilyPlan: boolean;
  isApplicable: boolean;
  status: ReportStatus;
  remarks: string;
};

type InterviewHistory = {
  family: DiseaseHistory[];
  familySpecific: DiseaseHistory[];
  medical: DiseaseHistory[];
  medicalSpecific: DiseaseHistory[];
  social: SocialHistory;
  surgical: DiseaseHistory[];
  menstrual: MenstrualHistory;
  pregnancy: PregnancyHistory;
};

enum PersonType {
  child = "child",
  elderly = "elderly",
  pregnant_women = "pregnant_women",
  young_women = "young_women",
}

type Immunization = {
  personType: PersonType;
  code: string;
  name: string;
  description: string;
};

export type Interview = {
  reviews?: ReviewOfSystems;
  history: InterviewHistory;
  immunization: Immunization[];
};
