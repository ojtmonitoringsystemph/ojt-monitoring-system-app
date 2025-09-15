export const formatPhoneNumber = (value: string) => {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, "");

  // Ensure it starts with '63' (Philippines)
  let cleaned = digits.startsWith("63") ? digits : `63${digits}`;

  // Remove leading '0' if it's mistakenly included (like 0917...)
  if (cleaned.startsWith("630")) cleaned = "63" + cleaned.slice(3);

  const number = cleaned.slice(2); // Drop the '63' for formatting

  // Format: +63 XXX XXX XXXX
  if (number.length <= 3) return `+63 ${number}`;
  if (number.length <= 6) return `+63 ${number.slice(0, 3)} ${number.slice(3)}`;
  if (number.length <= 10)
    return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;

  return `+63 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(
    6,
    10
  )}`;
};
export const getAge = (birthDate: string | Date) => {
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};
