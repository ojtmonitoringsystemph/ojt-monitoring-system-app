import {
  ClipboardList,
  File,
  FileText,
  FlaskConical,
  Heart,
  Pill,
  User,
} from "lucide-react";

import { MdNumbers } from "react-icons/md";

export const PATIENT_PORTAL_MAIN_PAGE = [
  { id: "records", title: "Patient Records", icon: <FileText size={16} /> },
  {
    id: "encounter",
    title: "Encounter",
    icon: <ClipboardList size={16} />,
  },
  {
    id: "personal_info",
    title: "Personal Information",
    icon: <ClipboardList size={16} />,
  },
];

export const PATIENT_PORTAL_VIEWS_PAGE = [
  {
    id: "summary",
    title: "Summary",
    icon: <FileText size={16} />,
    page: "Encounter",
  },
  {
    id: "atc",
    title: "ATC",
    icon: <User size={16} />,
    page: "Encounter",
  },
  {
    id: "interview",
    title: "FPE - Interview",
    icon: <User size={16} />,
    page: "Encounter",
  },
  {
    id: "vitals",
    title: "FPE - Vitals",
    icon: <Heart size={16} />,
    page: "Encounter",
  },
  {
    id: "consultation",
    title: "Consultation",
    icon: <ClipboardList size={16} />,
    page: "Encounter",
  },
  {
    id: "laboratory",
    title: "Laboratory",
    icon: <FlaskConical size={16} />,
    page: "Encounter",
  },
  {
    id: "prescription",
    title: "Prescription",
    icon: <Pill size={16} />,
    page: "Encounter",
  },
  {
    id: "documents",
    title: "Documents",
    icon: <File size={16} />,
    page: "Encounter",
  },
  {
    id: "queue",
    title: "Queue",
    icon: <MdNumbers size={16} />,
    page: "Encounter",
  },
];
