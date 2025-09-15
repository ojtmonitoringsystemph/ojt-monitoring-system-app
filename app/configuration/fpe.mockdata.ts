export interface FPEData {
  lastUpdated: string;
  status: string;
  reviewOfSystems: {
    chiefComplaint: string[];
    mental: { hasIssues: boolean; explain: string };
    respiratory: { hasIssues: boolean; explain: string };
    gi: { hasIssues: boolean; explain: string };
    urinary: { hasIssues: boolean; explain: string };
    genital: { hasIssues: boolean; explain: string };
  };
  history: {
    medical: {
      conditions: {
        [key: string]: { isDiagnosed: boolean; details: string };
      };
    };
    family: {
      conditions: {
        [key: string]: { isDiagnosed: boolean; details: string };
      };
    };
  };
  pastOperations: Array<{ operation: string; date: string }>;
  physicalExam: {
    bloodPressure: { systolic: number; diastolic: number };
    heartRate: { value: number; status: string };
    respiratoryRate: { value: number; status: string };
    temperature: { value: number; status: string };
    bmi: number;
    bloodType: string;
  };
  laboratory: {
    fbs: { value: number; status: string };
    rbs: { value: number; status: string };
  };
  immunization: {
    [key: string]: string[];
  };
  chd: {
    highFatFoodIntake: string;
    vegetableIntake: string;
    fruitIntake: string;
    physicalActivity: string;
    diabetesDiagnosis: string;
  };
}

// Mock data
const mockFPEData: FPEData = {
  lastUpdated: "2024-01-15",
  status: "Complete",
  reviewOfSystems: {
    chiefComplaint: ["Headache", "Fatigue"],
    mental: { hasIssues: true, explain: "Difficulty sleeping" },
    respiratory: { hasIssues: false, explain: "" },
    gi: { hasIssues: false, explain: "" },
    urinary: { hasIssues: false, explain: "" },
    genital: { hasIssues: false, explain: "" },
  },
  history: {
    medical: {
      conditions: {
        hypertension: { isDiagnosed: true, details: "Stage 1" },
        diabetesMellitus: { isDiagnosed: false, details: "" },
        allergies: { isDiagnosed: true, details: "Peanuts" },
        cancer: { isDiagnosed: false, details: "" },
        heartDisease: { isDiagnosed: false, details: "" },
        stroke: { isDiagnosed: false, details: "" },
        bronchialAsthma: { isDiagnosed: false, details: "" },
        copd: { isDiagnosed: false, details: "" },
        tuberculosis: { isDiagnosed: false, details: "" },
        asthma: { isDiagnosed: false, details: "" },
        cerebrovascularDisease: { isDiagnosed: false, details: "" },
        coronaryArteryDisease: { isDiagnosed: false, details: "" },
        emphysema: { isDiagnosed: false, details: "" },
        epilepsy: { isDiagnosed: false, details: "" },
        hepatitis: { isDiagnosed: false, details: "" },
        hyperlipidemia: { isDiagnosed: false, details: "" },
        pulmonaryTuberculosis: { isDiagnosed: false, details: "" },
        extrapulmonaryTuberculosis: { isDiagnosed: false, details: "" },
        urinaryTractInfection: { isDiagnosed: false, details: "" },
        mentalIllness: { isDiagnosed: false, details: "" },
        others: { isDiagnosed: false, details: "" },
      }
    },
    family: {
      conditions: {
        diabetesMellitus: { isDiagnosed: true, details: "Father" },
        hypertension: { isDiagnosed: true, details: "Mother" },
        cancer: { isDiagnosed: false, details: "" },
        allergies: { isDiagnosed: false, details: "" },
        heartDisease: { isDiagnosed: false, details: "" },
        stroke: { isDiagnosed: false, details: "" },
        bronchialAsthma: { isDiagnosed: false, details: "" },
        copd: { isDiagnosed: false, details: "" },
        tuberculosis: { isDiagnosed: false, details: "" },
        asthma: { isDiagnosed: false, details: "" },
        cerebrovascularDisease: { isDiagnosed: false, details: "" },
        coronaryArteryDisease: { isDiagnosed: false, details: "" },
        emphysema: { isDiagnosed: false, details: "" },
        epilepsy: { isDiagnosed: false, details: "" },
        hepatitis: { isDiagnosed: false, details: "" },
        hyperlipidemia: { isDiagnosed: false, details: "" },
        pulmonaryTuberculosis: { isDiagnosed: false, details: "" },
        extrapulmonaryTuberculosis: { isDiagnosed: false, details: "" },
        urinaryTractInfection: { isDiagnosed: false, details: "" },
        mentalIllness: { isDiagnosed: false, details: "" },
        others: { isDiagnosed: false, details: "" },
      }
    }
  },
  pastOperations: [
    { operation: "Appendectomy", date: "2020-03-15" }
  ],
  physicalExam: {
    bloodPressure: { systolic: 130, diastolic: 85 },
    heartRate: { value: 72, status: "normal" },
    respiratoryRate: { value: 16, status: "normal" },
    temperature: { value: 36.8, status: "normal" },
    bmi: 24.5,
    bloodType: "A+",
  },
  laboratory: {
    fbs: { value: 95, status: "normal" },
    rbs: { value: 120, status: "normal" },
  },
  immunization: {
    "Infant (0-2 years)": ["BCG", "DPT", "Hepatitis B"],
    "Child (3-12 years)": ["MMR", "Varicella"],
    "Adolescent (13-18 years)": ["HPV", "Meningococcal"],
    "Adult (19+ years)": ["Influenza", "Tdap"],
  },
  chd: {
    highFatFoodIntake: "no",
    vegetableIntake: "yes",
    fruitIntake: "yes",
    physicalActivity: "yes",
    diabetesDiagnosis: "no",
  },
};

// In-memory storage for mock data
const userFPEData = new Map<string, FPEData>();

export class FPEService {
  /**
   * Fetch FPE data for a user
   * @param userId - The user ID
   * @returns Promise<FPEData>
   */
  static async getFPEData(userId: string): Promise<FPEData> {
    try {
      // Return stored data if exists, otherwise return mock data
      if (userFPEData.has(userId)) {
        return userFPEData.get(userId) as FPEData;
      }
      
      // For new users, return mock data with a delay to simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({...mockFPEData, lastUpdated: new Date().toISOString().split('T')[0]});
        }, 500);
      });
    } catch (error) {
      console.error("Error fetching FPE data:", error);
      throw error;
    }
  }

  /**
   * Save FPE data
   * @param userId - The user ID
   * @param fpeData - The FPE data to save
   * @returns Promise<void>
   */
  static async saveFPEData(userId: string, fpeData: Partial<FPEData>): Promise<void> {
    try {
      // Get existing data or create new
      const existingData = userFPEData.has(userId) 
        ? userFPEData.get(userId) as FPEData 
        : {...mockFPEData};
      
      // Merge with new data
      const updatedData = {
        ...existingData,
        ...fpeData,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: "Complete"
      };
      
      // Store in memory
      userFPEData.set(userId, updatedData as FPEData);
      
      console.log("Saved FPE data for user:", userId);
    } catch (error) {
      console.error("Error saving FPE data:", error);
      throw error;
    }
  }

  /**
   * Update FPE data
   * @param userId - The user ID
   * @param fpeData - The FPE data to update
   * @returns Promise<void>
   */
  static async updateFPEData(userId: string, fpeData: Partial<FPEData>): Promise<void> {
    try {
      // This is essentially the same as save for mock purposes
      await this.saveFPEData(userId, fpeData);
      console.log("Updated FPE data for user:", userId);
    } catch (error) {
      console.error("Error updating FPE data:", error);
      throw error;
    }
  }

  /**
   * Get FPE status for a user
   * @param userId - The user ID
   * @returns Promise<{ status: string; lastUpdated: string }>
   */
  static async getFPEStatus(userId: string): Promise<{ status: string; lastUpdated: string }> {
    try {
      // Return stored status if exists, otherwise return mock status
      if (userFPEData.has(userId)) {
        const data = userFPEData.get(userId) as FPEData;
        return {
          status: data.status,
          lastUpdated: data.lastUpdated,
        };
      }
      
      // For new users, return mock status
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: mockFPEData.status,
            lastUpdated: mockFPEData.lastUpdated,
          });
        }, 300);
      });
    } catch (error) {
      console.error("Error fetching FPE status:", error);
      throw error;
    }
  }
}

export const fpeService = {
  exportFPE: (id: string): Promise<Blob> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock PDF blob for export
        const blob = new Blob(["Mock FPE Export Data"], { type: "application/pdf" });
        resolve(blob);
      }, 500);
    });
  },
};