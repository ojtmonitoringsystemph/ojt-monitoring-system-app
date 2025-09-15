export type Identification = {
  type: string;
  issuer?: string;
  description?: string;
  value: string;
};

export function formatBirthInfo(birthDate: string | null) {
  if (!birthDate) {
    return {
      ageText: "N/A",
      birthDateText: "N/A",
    };
  }

  const birth = new Date(birthDate);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  // Age Text
  const ageText = `${years} YRS${months > 0 ? ` AND ${months} MOS.` : ""} OLD`;

  // Birth Date Text (e.g. FEB. 12, 2001)
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  const birthDateText = birth
    .toLocaleDateString("en-US", options)
    .toUpperCase();

  return {
    ageText,
    birthDateText,
  };
}

export function getIdentificationValue(
  identifications: Identification[] = [],
  type: string,
  fallback: string = "N/A"
): string {
  return identifications.find((id) => id.type === type)?.value || fallback;
}
