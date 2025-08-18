  export const extractMonthDay = (date: string | null | undefined): string | null => {
    if (!date) return null;
    const parts = date.split("/");
    if (parts.length >= 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return null;
  };