export interface Address {
  unit?: string;
  buildingName?: string;
  houseNo?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
}

export interface Person {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  philHealthIdNumber?: string;
  birthDate?: string | Date;
  mobileNumber?: string;
  age?: string | number;
  gender?: string;
  clientType?: string;
  address?: Address[];
}

export interface MedicalCondition {
  isDiagnosed?: boolean;
  type?: string;
  details?: string;
}

export interface Explain {
  hasIssues?: boolean;
  explain?: string;
  details?: string;
}

export interface PhysicalExam {
  bloodPressure?: {
    systolic?: string | number;
    diastolic?: string | number;
  };
  heartRate?: {
    value?: string | number;
  };
  respiratoryRate?: {
    value?: string | number;
  };
  temperature?: {
    value?: string | number;
  };
  visualAcuity?: string;
  height?: {
    centimeter?: string | number;
    inches?: string | number;
  };
  weight?: {
    kilograms?: string | number;
    pounds?: string | number;
  };
  bmi?: string | number;
  bloodType?: string;
}

export interface Reviews {
  chiefComplaint?: string;
  mental?: Explain;
  respiratory?: Explain;
  gi?: Explain;
  urinary?: Explain;
  genital?: Explain;
  musculoskeletal?: Explain;
  lastMenstrualPeriod?: string | Date;
  firstMenstrualPeriod?: string | Date;
  pregnancyCount?: string | number;
}

export interface SocialHistory {
  smoker?: boolean;
  smokingYears?: string | number;
  alcohol?: boolean;
  alcoholYears?: string | number;
}

export interface MedicalHistory {
  conditions?: {
    cancer?: Explain;
    allergies?: Explain;
    diabetesMellitus?: Explain;
    hypertension?: Explain;
    heartDisease?: Explain;
    stroke?: Explain;
    bronchialAsthma?: Explain;
    copd?: Explain;
    tuberculosis?: Explain;
    others?: Explain;
  };
}

export interface PediatricData {
  length?: string | number;
  headCircumference?: string | number;
  skinfoldThickness?: string | number;
  waist?: string | number;
  hip?: string | number;
  limbs?: string | number;
  muac?: string | number;
}

export interface PKRFData {
  clientType?: string;
  date?: string | Date;
  kpp?: string;
  person?: Person;
}

export interface FPEData {
  screeningDate?: string | Date;
  visitType?: string;
  caseNumber?: string;
  person?: Person;
  reviews?: Reviews;
  history?: {
    social?: SocialHistory;
    medical?: MedicalHistory;
  };
  physicalExam?: PhysicalExam;
  pediatricData?: PediatricData;
}

export interface ExportResult {
  data: string;
  filename: string;
  mimeType: string;
}

/**
 * Format date to readable string
 * @param {Date|string|null|undefined} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format address array to readable string
 * @param {Address[]} addressArray - Array of address objects
 * @returns {string} Formatted address string
 */
const formatAddress = (addressArray: Address[] | undefined): string => {
  if (!addressArray || addressArray.length === 0) return "";
  
  const addr = addressArray[0]; // Get the first address
  const addressParts = [
    addr.unit,
    addr.buildingName,
    addr.houseNo,
    addr.street,
    addr.barangay,
    addr.city,
    addr.province,
  ].filter(Boolean);
  
  return addressParts.join(", ");
};

/**
 * Format full name from person data
 * @param {Person} person - Person object with firstName, middleName, lastName
 * @returns {string} Formatted full name
 */
const formatFullName = (person: Person | undefined): string => {
  if (!person) return "";
  return [person.lastName, person.firstName, person.middleName]
    .filter(Boolean)
    .join(" ");
};

/**
 * Format medical condition for display
 * @param {MedicalCondition} condition - Medical condition object
 * @returns {string} Formatted condition string
 */
const formatMedicalCondition = (condition: MedicalCondition | undefined): string => {
  if (!condition) return "";
  return condition.isDiagnosed
    ? `${condition.type || "Yes"} - ${condition.details || ""}`
    : "No";
};

/**
 * Format explain type for medical reviews
 * @param {Explain} explain - Explain object with hasIssues and explain properties
 * @returns {string} Formatted explain string
 */
const formatExplain = (explain: Explain | undefined): string => {
  if (!explain) return "";
  return explain.hasIssues ? explain.explain || "Yes" : "No";
};

/**
 * Format PKRF data for document generation
 * @param {PKRFData} pkrfData - PKRF data object
 * @returns {Record<string, string>} Formatted PKRF data for templates
 */
export const formatPKRFData = (pkrfData: PKRFData): Record<string, string> => {
  const { person } = pkrfData;
  
  const formattedAddress = formatAddress(person?.address);
  const fullName = formatFullName(person);

  return {
    // Basic PKRF info
    clientType: pkrfData.clientType || "",
    date: formatDate(pkrfData.date),
    kpp1: pkrfData.kpp || "",
    
    // Person details
    pin: person?.philHealthIdNumber || "",
    fName1: person?.firstName || "",
    mName1: person?.middleName || "",
    lName1: person?.lastName || "",
    "person.fullName": fullName,
    "person.address.full": formattedAddress,
    brgy1: person?.address?.[0]?.barangay || "",
    city1: person?.address?.[0]?.city || "",
    province1: person?.address?.[0]?.province || "",
    birth1: formatDate(person?.birthDate),
    contact: person?.mobileNumber || "",
    
    // Additional fields (for templates that need them)
    fName2: "",
    mName2: "",
    lName2: "",
    brgy2: "",
    city2: "",
    province2: "",
    kpp2: "",
  };
};

/**
 * Format physical examination data
 * @param {PhysicalExam} physicalExam - Physical examination object
 * @returns {Record<string, string>} Formatted physical examination data
 */
export const formatPhysicalExamData = (physicalExam: PhysicalExam | undefined): Record<string, string> => {
  if (!physicalExam) return {};

  return {
    // Blood Pressure
    "physicalExam.bp.systolic": physicalExam.bloodPressure?.systolic?.toString() || "",
    "physicalExam.bp.diastolic": physicalExam.bloodPressure?.diastolic?.toString() || "",
    
    // Vital Signs
    "physicalExam.heartRate": physicalExam.heartRate?.value?.toString() || "",
    "physicalExam.respiratoryRate": physicalExam.respiratoryRate?.value?.toString() || "",
    "physicalExam.temperature": physicalExam.temperature?.value?.toString() || "",
    
    // Visual Acuity
    "physicalExam.visualAcuity.left": physicalExam.visualAcuity?.split("/")[0] || "",
    "physicalExam.visualAcuity.right": physicalExam.visualAcuity?.split("/")[1] || "",
    
    // Height
    "physicalExam.height.centimeter": physicalExam.height?.centimeter?.toString() || "",
    "physicalExam.height.inches": physicalExam.height?.inches?.toString() || "",
    
    // Weight
    "physicalExam.weight.kilograms": physicalExam.weight?.kilograms?.toString() || "",
    "physicalExam.weight.pounds": physicalExam.weight?.pounds?.toString() || "",
    
    // BMI
    "physicalExam.bmi": physicalExam.bmi?.toString() || "",
    
    // Blood Type (with checkbox formatting)
    "physicalExam.bloodType.aPositive": physicalExam.bloodType === "a_positive" ? "●" : "◯",
    "physicalExam.bloodType.aNegative": physicalExam.bloodType === "a_negative" ? "●" : "◯",
    "physicalExam.bloodType.bPositive": physicalExam.bloodType === "b_positive" ? "●" : "◯",
    "physicalExam.bloodType.bNegative": physicalExam.bloodType === "b_negative" ? "●" : "◯",
    "physicalExam.bloodType.abPositive": physicalExam.bloodType === "ab_positive" ? "●" : "◯",
    "physicalExam.bloodType.abNegative": physicalExam.bloodType === "ab_negative" ? "●" : "◯",
    "physicalExam.bloodType.oPositive": physicalExam.bloodType === "o_positive" ? "●" : "◯",
    "physicalExam.bloodType.oNegative": physicalExam.bloodType === "o_negative" ? "●" : "◯",
  };
};

/**
 * Format review of systems data
 * @param {Reviews} reviews - Review of systems object
 * @returns {Record<string, string>} Formatted review data
 */
export const formatReviewOfSystems = (reviews: Reviews | undefined): Record<string, string> => {
  if (!reviews) return {};

  return {
    // Chief Complaint
    "reviews.chiefComplaint": reviews.chiefComplaint || "",
    
    // Mental
    "reviews.mental.positive": reviews.mental?.hasIssues ? "●" : "◯",
    "reviews.mental.negative": reviews.mental?.hasIssues ? "◯" : "●",
    "reviews.mental.explain": formatExplain(reviews.mental),
    
    // Respiratory
    "reviews.respiratory.positive": reviews.respiratory?.hasIssues ? "●" : "◯",
    "reviews.respiratory.negative": reviews.respiratory?.hasIssues ? "◯" : "●",
    "reviews.respiratory.explain": formatExplain(reviews.respiratory),
    
    // Gastrointestinal
    "reviews.gi.positive": reviews.gi?.hasIssues ? "●" : "◯",
    "reviews.gi.negative": reviews.gi?.hasIssues ? "◯" : "●",
    "reviews.gi.explain": formatExplain(reviews.gi),
    
    // Urinary
    "reviews.urinary.hasIssues": reviews.urinary?.hasIssues ? "true" : "false",
    "reviews.urinary.positive": reviews.urinary?.hasIssues ? "●" : "◯",
    "reviews.urinary.negative": reviews.urinary?.hasIssues ? "◯" : "●",
    "reviews.urinary.explain": formatExplain(reviews.urinary),
    
    // Genital
    "reviews.genital.hasIssues": reviews.genital?.hasIssues ? "true" : "false",
    "reviews.genital.positive": reviews.genital?.hasIssues ? "●" : "◯",
    "reviews.genital.negative": reviews.genital?.hasIssues ? "◯" : "●",
    "reviews.genital.explain": formatExplain(reviews.genital),
    
    // Musculoskeletal
    "reviews.musculoskeletal.hasIssues": reviews.musculoskeletal?.hasIssues ? "true" : "false",
    "reviews.musculoskeletal.positive": reviews.musculoskeletal?.hasIssues ? "●" : "◯",
    "reviews.musculoskeletal.negative": reviews.musculoskeletal?.hasIssues ? "◯" : "●",
    "reviews.musculoskeletal.explain": formatExplain(reviews.musculoskeletal),
    
    // Menstrual
    "reviews.lastMenstrualPeriod": formatDate(reviews.lastMenstrualPeriod),
    "reviews.firstMenstrualPeriod": formatDate(reviews.firstMenstrualPeriod),
    "reviews.pregnancyCount": reviews.pregnancyCount?.toString() || "",
  };
};

/**
 * Format social history data
 * @param {SocialHistory} social - Social history object
 * @returns {Record<string, string>} Formatted social history data
 */
export const formatSocialHistory = (social: SocialHistory | undefined): Record<string, string> => {
  if (!social) return {};

  return {
    // Smoking
    "history.social.smoking.positive": social.smoker ? "●" : "◯",
    "history.social.smoking.negative": social.smoker ? "◯" : "●",
    "history.social.smokingYears": social.smokingYears?.toString() || "",
    
    // Alcohol
    "history.social.alcohol.positive": social.alcohol ? "●" : "◯",
    "history.social.alcohol.negative": social.alcohol ? "◯" : "●",
    "history.social.alcoholYears": social.alcoholYears?.toString() || "",
  };
};

/**
 * Format medical history data
 * @param {MedicalHistory} medical - Medical history object
 * @returns {Record<string, string>} Formatted medical history data
 */
export const formatMedicalHistory = (medical: MedicalHistory | undefined): Record<string, string> => {
  if (!medical) return {};

  const conditions = medical.conditions || {};

  // List of all condition keys to check
  const conditionKeys = [
    'cancer',
    'allergies',
    'diabetesMellitus',
    'hypertension',
    'heartDisease',
    'stroke',
    'bronchialAsthma',
    'copd',
    'tuberculosis',
    'others',
  ];

  // Determine if all conditions are false (none have hasIssues true)
  const noneChecked = conditionKeys.every(
    key => !(conditions as Record<string, Explain | undefined>)[key]?.hasIssues
  );

  return {
    // Medical conditions with checkboxes
    "medicalHistory.cancer": conditions.cancer?.hasIssues ? "☑" : "□",
    "medicalHistory.allergies": conditions.allergies?.hasIssues ? "☑" : "□",
    "medicalHistory.diabetesMellitus": conditions.diabetesMellitus?.hasIssues ? "☑" : "□",
    "medicalHistory.hypertension": conditions.hypertension?.hasIssues ? "☑" : "□",
    "medicalHistory.heartDisease": conditions.heartDisease?.hasIssues ? "☑" : "□",
    "medicalHistory.stroke": conditions.stroke?.hasIssues ? "☑" : "□",
    "medicalHistory.bronchialAsthma": conditions.bronchialAsthma?.hasIssues ? "☑" : "□",
    "medicalHistory.copd": conditions.copd?.hasIssues ? "☑" : "□",
    "medicalHistory.tuberculosis": conditions.tuberculosis?.hasIssues ? "☑" : "□",
    "medicalHistory.others": conditions.others?.hasIssues ? "☑" : "□",
    "medicalHistory.others.details": conditions.others?.details || "",
    "medicalHistory.none": noneChecked ? "☑" : "□",
  };
};

/**
 * Format pediatric data
 * @param {PediatricData} pediatricData - Pediatric data object
 * @returns {Record<string, string>} Formatted pediatric data
 */
export const formatPediatricData = (pediatricData: PediatricData | undefined): Record<string, string> => {
  if (!pediatricData) return {};

  return {
    "pediatricData.length": pediatricData.length?.toString() || "",
    "pediatricData.headCircumference": pediatricData.headCircumference?.toString() || "",
    "pediatricData.skinfoldThickness": pediatricData.skinfoldThickness?.toString() || "",
    "pediatricData.waist": pediatricData.waist?.toString() || "",
    "pediatricData.hip": pediatricData.hip?.toString() || "",
    "pediatricData.limbs": pediatricData.limbs?.toString() || "",
    "pediatricData.muac": pediatricData.muac?.toString() || "",
  };
};

/**
 * Format FPE data for document generation
 * @param {FPEData} fpeData - FPE data object
 * @returns {Record<string, string>} Formatted FPE data for templates
 */
export const formatFPEData = (fpeData: FPEData): Record<string, string> => {
  const { person, reviews, history, physicalExam, pediatricData } = fpeData;
  
  const formattedAddress = formatAddress(person?.address);
  const fullName = formatFullName(person);

  return {
    // Basic FPE info
    screeningDate: formatDate(fpeData.screeningDate),
    "visitType.walkIn": fpeData.visitType === "walk_in_clients" ? "☑" : "□",
    "visitType.appointment": fpeData.visitType === "with_appointment" ? "☑" : "□",
    caseNumber: fpeData.caseNumber || "",
    "person.philHealthIdNumber": person?.philHealthIdNumber || "",

    // Person details
    "person.lastName": person?.lastName || "",
    "person.firstName": person?.firstName || "",
    "person.middleName": person?.middleName || "",
    "person.suffix": person?.suffix || "",
    "person.fullName": fullName,
    "person.address.barangay": person?.address?.[0]?.barangay || "",
    "person.address.city": person?.address?.[0]?.city || "",
    "person.address.province": person?.address?.[0]?.province || "",
    "person.address.full": formattedAddress,
    "person.birthDate": formatDate(person?.birthDate),
    "person.age": person?.age?.toString() || "",
    "person.gender": person?.gender || "",
    "person.mobileNumber": person?.mobileNumber || "",
    "person.clientType": person?.clientType || "",

    // Include all formatted sections
    ...formatReviewOfSystems(reviews),
    ...formatSocialHistory(history?.social),
    ...formatMedicalHistory(history?.medical),
    ...formatPhysicalExamData(physicalExam),
    ...formatPediatricData(pediatricData),
  };
};

/**
 * Utility function to download base64 document
 * @param {string} base64Data - Base64 encoded document data
 * @param {string} filename - Filename for download
 * @param {string} mimeType - MIME type of the document
 */
export const downloadBase64Document = (base64Data: string, filename: string, mimeType: string): void => {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

export default {
  formatPKRFData,
  formatFPEData,
  formatPhysicalExamData,
  formatReviewOfSystems,
  formatSocialHistory,
  formatMedicalHistory,
  formatPediatricData,
  
  downloadBase64Document,
};