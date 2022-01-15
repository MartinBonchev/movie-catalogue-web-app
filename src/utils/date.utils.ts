export const extractYearFrom = (date: string) => {
  const year = new Date(date).getFullYear();
  return year;
};
