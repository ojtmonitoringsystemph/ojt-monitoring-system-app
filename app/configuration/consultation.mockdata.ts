

export interface ConsultationData {
  consultationId: string;
  date: string;
  attendingPhysician: string;
  complaint: string;
  diagnosis?: string;
  doctorsOrders?: string;
  status: 'completed' | 'pending' | 'cancelled';
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  laboratoryTests?: Array<{
    testName: string;
    result?: string;
    status: 'pending' | 'completed' | 'normal' | 'abnormal';
  }>;
  followUpDate?: string;
  notes?: string;
}

const mockConsultationData: ConsultationData[] = [
  {
    consultationId: "CONS-2024-001",
    date: "2024-01-15",
    attendingPhysician: "Dr. Maria Santos",
    complaint: "Persistent headache and fatigue for the past week",
    diagnosis: "Tension headache with mild dehydration",
    doctorsOrders: "Prescribed paracetamol 500mg every 6 hours as needed. Advised to increase water intake and get adequate rest.",
    status: "completed",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 36.8,
      weight: 65
    },
    medications: [
      {
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Every 6 hours",
        duration: "3 days"
      }
    ],
    laboratoryTests: [
      {
        testName: "Complete Blood Count",
        result: "Normal",
        status: "completed"
      }
    ],
    followUpDate: "2024-01-22",
    notes: "Patient advised to return if symptoms persist beyond 3 days."
  },
  {
    consultationId: "CONS-2024-002",
    date: "2024-01-08",
    attendingPhysician: "Dr. Juan Dela Cruz",
    complaint: "Chest pain and shortness of breath",
    diagnosis: "Acute bronchitis",
    doctorsOrders: "Prescribed antibiotics and bronchodilator. Advised to rest and avoid smoking.",
    status: "completed",
    vitalSigns: {
      bloodPressure: "135/85",
      heartRate: 88,
      temperature: 37.2,
      weight: 65
    },
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days"
      },
      {
        name: "Salbutamol",
        dosage: "2 puffs",
        frequency: "As needed",
        duration: "Until symptoms improve"
      }
    ],
    laboratoryTests: [
      {
        testName: "Chest X-Ray",
        result: "Mild bronchial inflammation",
        status: "completed"
      }
    ],
    followUpDate: "2024-01-15",
    notes: "Patient responded well to treatment. Symptoms improved significantly."
  },
  {
    consultationId: "CONS-2023-015",
    date: "2023-12-20",
    attendingPhysician: "Dr. Ana Reyes",
    complaint: "Annual physical examination",
    diagnosis: "Normal physical examination",
    doctorsOrders: "Continue current medications. Schedule follow-up in 6 months.",
    status: "completed",
    vitalSigns: {
      bloodPressure: "118/78",
      heartRate: 70,
      temperature: 36.6,
      weight: 64
    },
    medications: [],
    laboratoryTests: [
      {
        testName: "Fasting Blood Sugar",
        result: "95 mg/dL",
        status: "completed"
      },
      {
        testName: "Lipid Profile",
        result: "Normal",
        status: "completed"
      }
    ],
    followUpDate: "2024-06-20",
    notes: "All vital signs within normal range. No new concerns identified."
  },
  {
    consultationId: "CONS-2023-012",
    date: "2023-11-15",
    attendingPhysician: "Dr. Carlos Mendoza",
    complaint: "Lower back pain after lifting heavy objects",
    diagnosis: "Muscle strain",
    doctorsOrders: "Prescribed pain relievers and muscle relaxants. Advised to rest and avoid heavy lifting.",
    status: "completed",
    vitalSigns: {
      bloodPressure: "125/82",
      heartRate: 75,
      temperature: 36.9,
      weight: 65
    },
    medications: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 8 hours",
        duration: "5 days"
      },
      {
        name: "Methocarbamol",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days"
      }
    ],
    laboratoryTests: [],
    followUpDate: "2023-11-22",
    notes: "Patient reported significant improvement after 3 days of treatment."
  }
];

export class ConsultationService {
  static async getConsultationHistory(userId: string): Promise<ConsultationData[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/consultations/${userId}`);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockConsultationData);
        }, 500);
      });
    } catch (error) {
      console.error("Error fetching consultation history:", error);
      throw error;
    }
  }

  static async getConsultationDetails(consultationId: string): Promise<ConsultationData> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/consultations/${consultationId}`);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          const consultation = mockConsultationData.find(c => c.consultationId === consultationId);
          if (consultation) {
            resolve(consultation);
          } else {
            throw new Error("Consultation not found");
          }
        }, 300);
      });
    } catch (error) {
      console.error("Error fetching consultation details:", error);
      throw error;
    }
  }

  static async createConsultation(data: Partial<ConsultationData>): Promise<ConsultationData> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post("/consultations", data);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          const newConsultation: ConsultationData = {
            consultationId: `CONS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            attendingPhysician: data.attendingPhysician || "Dr. Unknown",
            complaint: data.complaint || "",
            diagnosis: data.diagnosis,
            doctorsOrders: data.doctorsOrders,
            status: data.status || "pending",
            vitalSigns: data.vitalSigns,
            medications: data.medications,
            laboratoryTests: data.laboratoryTests,
            followUpDate: data.followUpDate,
            notes: data.notes
          };
          resolve(newConsultation);
        }, 500);
      });
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw error;
    }
  }

  static async updateConsultation(consultationId: string, data: Partial<ConsultationData>): Promise<ConsultationData> {
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/consultations/${consultationId}`, data);
      // return response.data;

      return new Promise((resolve) => {
        setTimeout(() => {
          const consultation = mockConsultationData.find(c => c.consultationId === consultationId);
          if (consultation) {
            const updatedConsultation = { ...consultation, ...data };
            resolve(updatedConsultation);
          } else {
            throw new Error("Consultation not found");
          }
        }, 300);
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  }
}
