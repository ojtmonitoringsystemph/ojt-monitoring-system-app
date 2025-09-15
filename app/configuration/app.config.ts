export const APP = {};

export const LANG = [
  { code: "en", label: "English" },
  { code: "tl", label: "Filipino (Tagalog)" },
] as const;

type LangCode = (typeof LANG)[number]["code"];

const getTranslation = (
  data: Record<"EN" | "TL", string>,
  lang: LangCode
): string => {
  return data[lang.toUpperCase() as "EN" | "TL"];
};

export const CONTENT = (lang: LangCode) => ({
  PKRF: {
    TITLE: getTranslation(
      {
        EN: "PHilHealth Konsulta Registration Form",
        TL: "PHilHealth Konsulta Registration Form",
      },
      lang
    ),
    INSTRUCTION_KEY: getTranslation(
      {
        EN: "Instructions",
        TL: "Panuto",
      },
      lang
    ),
    INSTRUCTION_VALUE: [
      getTranslation(
        {
          EN: "1. All fields are mandatory.",
          TL: "1. Lahat ng bahagi ng form ay kailangang sagutan.",
        },
        lang
      ),
      getTranslation(
        {
          EN: "2. If the beneficiary is dependent, use the dependent PIN.",
          TL: "2. Kung ang benepisyaryo ay isang dependent, gamitin ang PIN ng dependent.",
        },
        lang
      ),
      getTranslation(
        {
          EN: "3.If the beneficiary is below 21 years old, the signatory should be the parent/guardian.",
          TL: "3.Kung ang benepisyaryo ay wala pang 21 taong gulang, ang pipirma ay dapat magulang o tagapangalaga.",
        },
        lang
      ),
      getTranslation(
        {
          EN: "4. Some fields already have default values, but you can choose the correct answer if you know it.",
          TL: "4. May default na sagot ang ilang field, pero maaari kang pumili ng tamang sagot kung alam mo.",
        },
        lang
      ),
    ],
  },
});
