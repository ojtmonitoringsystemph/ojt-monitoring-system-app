export const OPTIONS = () => {
  type Option = {
    value: string;
    label: string;
    options?: Option[];
  };

  const STUDENT = {
    DIAGNOSIS: [
      {
        value: "attention-deficit-hyperactivity-disorder",
        label: "Attention Deficit Hyperactivity Disorder",
      },
      {
        value: "autism-spectrum-disorder",
        label: "Autism Spectrum Disorder",
      },
      { value: "cerebral-palsy", label: "Cerebral Palsy" },
      {
        value: "emotional-behavioral-disorder",
        label: "Emotional Behavioral Disorder",
      },
      { value: "hearing-impairment", label: "Hearing Impairment" },
      {
        value: "intellectual-disability",
        label: "Intellectual Disability",
      },
      {
        value: "learning-disability",
        label: "Learning Disability",
      },
      {
        value: "multiple-disabilities",
        label: "Multiple Disabilities",
      },
      {
        value: "orthopedic-physical-handicap",
        label: "Orthopedic/Physical Handicap",
      },
      {
        value: "speech-language-disorder",
        label: "Speech/Language Disorder",
      },
      {
        value: "special-health-problem-chronic-disease",
        label: "Special Health Problem/Chronic Disease",
        options: [
          { value: "cancer", label: "Cancer" },
          { value: "non-cancer", label: "Non-Cancer" },
        ],
      },
      {
        value: "visual-impairment",
        label: "Visual Impairment",
        options: [
          { value: "blind", label: "Blind" },
          { value: "low-vision", label: "Low Vision" },
        ],
      },
    ],
    MANIFESTATIONS: [
      {
        value: "difficulty-in-applying-knowledge",
        label: "Difficulty in Applying Knowledge",
      },
      {
        value: "difficulty-in-communicating",
        label: "Difficulty in Communicating",
      },
      {
        value: "difficulty-in-displaying-interpersonal-behavior",
        label: "Difficulty in Displaying Interpersonal Behavior",
      },
      {
        value: "difficulty-in-hearing",
        label: "Difficulty in Hearing",
      },
      {
        value: "difficulty-in-mobility",
        label: "Difficulty in Mobility (Walking, Climbing, Grasping)",
      },
      {
        value: "difficulty-in-performing-adaptive-skills",
        label: "Difficulty in Performing Adaptive Skills (Self-Care)",
      },
      {
        value:
          "difficulty-in-remembering-concentrating-paying-attention-and-understanding",
        label:
          "Difficulty in Remembering, Concentrating, Paying Attention, and Understanding",
      },
      {
        value: "difficulty-in-seeing",
        label: "Difficulty in Seeing",
      },
    ],
    LEARNING_MODALITIES: [
      {
        value: "modular-print",
        label: "Modular (Print)",
      },
      {
        value: "modular-digital",
        label: "Modular (Digital)",
      },
      {
        value: "online",
        label: "Online",
      },
      {
        value: "educational-tv",
        label: "Educational Television (ETV)",
      },
      {
        value: "radio-based-instruction",
        label: "Radio-Based Instruction",
      },
      {
        value: "homeschooling",
        label: "Homeschooling",
      },
      {
        value: "blended",
        label: "Blended",
      },
    ],
  };

  return { STUDENT };
};
