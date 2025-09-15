// Enums
export enum VisionStatus {
  normal = "normal",
  abnormal = "abnormal",
}

export enum MiscType {
  skin = "skin",
  heent = "heent",
  chest = "chest",
  heart = "heart",
  abdomen = "abdomen",
  neurological = "neurological",
  digital_rectal = "digital_rectal",
  genitourinary = "genitourinary",
}

export enum ReportStatus {
  pending = "pending",
  completed = "completed",
}

export enum PhysicalExamStatus {
  normal = "normal",
  abnormal = "abnormal",
}

export enum PersonBloodType {
  A = "a_positive",
  B = "b_positive",
  AB = "ab_positive",
  O = "o_positive",
  A_ = "a_negative",
  B_ = "b_negative",
  AB_ = "ab_negative",
  O_ = "o_negative",
}

export enum MeasurementUnit {
  cm = "cm",
  kg = "kg",
  mmHg = "mmHg",
  bpm = "bpm",
  celsius = "celsius",
}

// Types
export type VitalVision = {
  left: number;
  right: number;
  status: VisionStatus;
  remarks?: string;
};

export type Blood = {
  type?: PersonBloodType;
  status: ReportStatus;
  remarks?: string;
};

export type BloodPressure = {
  systolic: number; // default: 0
  diastolic: number; // default: 0
  category: string;
};

export type PhysicalExam = {
  status?: string;
  value?: number;
};

export type Measurement = {
  value: number;
  unit: MeasurementUnit;
};

export type BMI = {
  value: number;
  status: string;
};

export type VitalMeasurement = {
  bloodPressure?: BloodPressure;
  heartRate?: PhysicalExam;
  respiratoryRate?: PhysicalExam;
  height: Measurement;
  weight: Measurement;
  bmi: BMI;
  zscore: number;
  length: number;
  headCirc: number;
  skinfoldThickness: number;
  waist: number;
  hip: number;
  limbs: number;
  temperature: Measurement;
  midUpperArmCirc: number;
  status: VisionStatus;
};

export type Misc = {
  description: string;
  type: MiscType;
  status: ReportStatus;
  remarks?: string;
  tag: PhysicalExamStatus;
};

export type Vital = {
  vision?: VitalVision;
  measurement?: VitalMeasurement;
  misc: Misc[];
  blood?: Blood;
  status: ReportStatus;
};
