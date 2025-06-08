export const formatDateOnly = (dateTime: string | undefined) => {
  if (!dateTime) return "";
  const datePart = dateTime.split(" ")[0]; // "1402/02/16"
  return datePart.replace(/\//g, "/");     // "1402-02-16"
};
