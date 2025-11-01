export const MEDICAL_HISTORY_LIBRARY = [
  {
    key: "001",
    label: "Allergy",
    details: {
      fields: [
        {
          key: "allergy_type",
          label: "Specify Allergy",
          field: "allergyType",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "002",
    label: "Asthma",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "003",
    label: "Cancer",
    details: {
      fields: [
        {
          key: "cancer_type",
          label: "Specify organ with cancer",
          field: "cancerType",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "004",
    label: "Cerebrovascular Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "005",
    label: "Coronary Artery Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "006",
    label: "Diabetes Mellitus",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "007",
    label: "Emphysema",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "008",
    label: "Epilepsy",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "009",
    label: "Hepatitis",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "010",
    label: "Hyperlipidemia",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "011",
    label: "Hypertension",
    details: {
      fields: [
        {
          key: "hbp_systolic",
          label: "Systolic",
          field: "systolic",
          type: "number",
        },
        {
          key: "hbp_diastolic",
          label: "Diastolic",
          field: "diastolic",
          type: "number",
        },
      ],
      metadata: { type: "fraction", unit: "mmHg" },
    },
  },
  {
    key: "012",
    label: "Peptic Ulcer",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "013",
    label: "Pneumonia",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "014",
    label: "Thyroid Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "015",
    label: "Pulmonary Tuberculosis",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "016",
    label: "Extrapulmonary Tuberculosis",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "017",
    label: "Urinary Tract Infection",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "018",
    label: "Mental Illness",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "998",
    label: "Others",
    details: {
      fields: [
        {
          key: "others_category",
          label: "Others, please Specify:",
          field: "others",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
];
