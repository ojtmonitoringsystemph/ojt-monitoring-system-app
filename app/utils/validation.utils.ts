// Validation functions for encounter forms

export const validateVitalsStep = (vitalsData: any) => {
  const errors: string[] = [];
  
  if (!vitalsData.bloodPressure.systolic || !vitalsData.bloodPressure.diastolic) {
    errors.push("Blood pressure (systolic and diastolic) is required");
  }
  
  if (!vitalsData.heartRate) {
    errors.push("Heart rate is required");
  }
  
  if (!vitalsData.respiratoryRate) {
    errors.push("Respiratory rate is required");
  }
  
  if (!vitalsData.temperature) {
    errors.push("Temperature is required");
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateFindingsStep = (vitalsData: any) => {
  const errors: string[] = [];
  
  // Check if at least one finding is selected in each section
  const sections = ['heent', 'chestBreastLungs', 'heart', 'abdomen', 'genitourinary', 'dre', 'extremities', 'neurological'];
  
  sections.forEach(section => {
    const findings = vitalsData.findings[section];
    if (!findings || findings.length === 0 || (findings.length === 1 && findings[0] === '')) {
      errors.push(`At least one finding must be selected for ${section.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};

export const validateLabImagingStep = (vitalsData: any) => {
  const errors: string[] = [];
  
  if (!vitalsData.labImaging.date) {
    errors.push("Laboratory/Imaging date is required");
  }
  
  if (!vitalsData.labImaging.fee) {
    errors.push("Laboratory/Imaging fee is required");
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateCHDStep = (vitalsData: any) => {
  const errors: string[] = [];
  
  const chdFields = ['highFatHighSalt', 'fiberVeg', 'fiberFruits', 'physicalActivity', 'diabetesDiagnosed'];
  
  chdFields.forEach(field => {
    if (!vitalsData.chd[field] || vitalsData.chd[field] === '') {
      errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be answered`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};
