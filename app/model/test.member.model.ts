export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  membershipType: string;
  photo: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface HealthCheckupRecord {
  id: number;
  date: string;
  doctor: string;
  hospital: string;
  status: string;
  findings: string;
  recommendations: string;
  isLatest: boolean;
}

export interface MedicalService {
  id: number;
  name: string;
  price: number;
}

export interface EkasService extends MedicalService {
  quantity: number;
}

export interface EkasRecord {
  id: number;
  date: string;
  doctor: string;
  hospital: string;
  caseNo: string;
  status: string;
  services: EkasService[];
  totalAmount: number;
  isLatest: boolean;
}

export interface Medication {
  id: number;
  name: string;
  type: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface EpressRecord {
  id: number;
  date: string;
  doctor: string;
  hospital: string;
  caseNo: string;
  status: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  isLatest: boolean;
}

export interface TestResult {
  id: number;
  date: string;
  testName: string;
  category: string;
  status: "pending" | "completed" | "cancelled";
  result?: string;
  referenceRange?: string;
  unit?: string;
  notes?: string;
  attachments?: {
    id: number;
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  department: string;
  location: string;
  type: "consultation" | "follow-up" | "procedure" | "check-up";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  reason?: string;
} 