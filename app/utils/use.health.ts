export function isPediatricClient(birthdayStr?: string): boolean {
  if (!birthdayStr) return false;

  const birthday = new Date(birthdayStr);
  const today = new Date();

  // Calculate difference in months
  let ageInMonths =
    (today.getFullYear() - birthday.getFullYear()) * 12 +
    (today.getMonth() - birthday.getMonth());

  // If the day of the current month is less than the birth day, subtract 1 month
  if (today.getDate() < birthday.getDate()) {
    ageInMonths -= 1;
  }

  return ageInMonths >= 0 && ageInMonths <= 24;
}
