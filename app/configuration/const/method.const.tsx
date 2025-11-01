import {
  ClipboardList,
  Code,
  File,
  FileText,
  FlaskConical,
  Heart,
  IdCard,
  Link,
  Pill,
  QrCode,
  User,
  UserCircle,
  Users,
} from "lucide-react";
import { FaFileUpload } from "react-icons/fa";

export const REGISTRATION_METHOD = [
  {
    name: "Assisted/Manual",
    path: "/yakap/registration/assisted-manual",
    icon: <Users className="w-12 h-12 text-blue-500" />,
    description: "Manual registration process with assistance from staff",
    content: {
      title: "Assisted/Manual Registration",
      description:
        "This registration method allows staff to manually input patient information with assistance and generate shareable links for patients.",
      features: [
        "Staff-assisted data entry",
        "Real-time validation",
        "Manual verification process",
        "Custom field support",
        "Shareable link generation",
        "Staff tracking and accountability",
      ],
      steps: [
        "Staff member initiates registration",
        "Patient provides required information",
        "Staff enters data into system",
        "Information is validated",
        "Registration is completed",
        "Shareable link is generated for future use",
      ],
    },
  },
  {
    name: "On-site Registration",
    path: "/yakap/registration/on-site-registration",
    icon: <UserCircle className="w-12 h-12 text-blue-500" />,
    description: "Registration conducted at physical clinic locations",
    content: {
      title: "On-site Registration",
      description:
        "Registration process conducted directly at clinic locations with physical presence.",
      features: [
        "Physical presence required",
        "Direct staff interaction",
        "Immediate verification",
        "Document scanning support",
      ],
      steps: [
        "Patient visits clinic location",
        "Staff verifies identity",
        "Documents are scanned",
        "Information is entered",
        "Registration is confirmed",
      ],
    },
  },
  {
    name: "Government Issued ID",
    path: "/yakap/registration/government-issued-id",
    icon: <IdCard className="w-12 h-12 text-blue-500" />,
    description: "Registration using government-issued identification",
    content: {
      title: "Government Issued ID Registration",
      description:
        "Registration process using official government-issued identification documents.",
      features: [
        "ID verification system",
        "OCR document scanning",
        "Government database integration",
        "Secure data handling",
      ],
      steps: [
        "Patient presents government ID",
        "System scans and reads ID",
        "Information is extracted",
        "Data is verified",
        "Registration is processed",
      ],
    },
  },
  {
    name: "Sharable Link",
    path: "/yakap/registration/sharable-link",
    icon: <Link className="w-12 h-12 text-blue-500" />,
    description: "Registration through shareable web links",
    content: {
      title: "Sharable Link Registration",
      description:
        "Registration process using shareable web links that can be distributed to patients.",
      features: [
        "Customizable registration links",
        "Link expiration settings",
        "Tracking and analytics",
        "Mobile-responsive forms",
      ],
      steps: [
        "Generate registration link",
        "Share link with patient",
        "Patient completes form",
        "Data is submitted",
        "Registration is confirmed",
      ],
    },
  },
  {
    name: "QR Code",
    path: "/yakap/registration/qr-code",
    icon: <QrCode className="w-12 h-12 text-blue-500" />,
    description: "Registration using QR code scanning",
    content: {
      title: "QR Code Registration",
      description:
        "Registration process using QR codes that can be scanned by mobile devices.",
      features: [
        "QR code generation",
        "Mobile app integration",
        "Offline capability",
        "Batch QR code creation",
      ],
      steps: [
        "Generate QR code",
        "Patient scans code",
        "Mobile form opens",
        "Patient enters information",
        "Registration is submitted",
      ],
    },
  },
  {
    name: "File Upload",
    path: "/yakap/registration/file-upload",
    icon: <FaFileUpload className="w-12 h-12 text-blue-500" />,
    description: "Registration through document file uploads",
    content: {
      title: "File Upload Registration",
      description:
        "Registration process allowing patients to upload required documents.",
      features: [
        "Multiple file format support",
        "File size validation",
        "Secure file storage",
        "Document verification",
      ],
      steps: [
        "Patient accesses upload portal",
        "Required documents are selected",
        "Files are uploaded",
        "System processes documents",
        "Registration is completed",
      ],
    },
  },
  {
    name: "Integration",
    path: "/yakap/registration/integration",
    icon: <Code className="w-12 h-12 text-blue-500" />,
    description: "Registration through third-party system integration",
    content: {
      title: "Integration Registration",
      description:
        "Registration process through integration with third-party systems and APIs.",
      features: [
        "API integration",
        "Real-time data sync",
        "Multiple system support",
        "Automated processing",
      ],
      steps: [
        "System integration setup",
        "Data is received from partner",
        "Information is validated",
        "Registration is processed",
        "Confirmation is sent",
      ],
    },
  },
];
