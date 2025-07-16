export const formatDateOnly = (dateTime: string | undefined) => {
  if (!dateTime) return "";
  const datePart = dateTime.split(" ")[0];
  return datePart.replace(/\//g, "/");    
};
