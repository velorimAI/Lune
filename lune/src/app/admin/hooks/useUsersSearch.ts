import { useMemo } from "react";

export const useUsersSearch = (
  data: any[],
  searchText: string,
  searchField: string
) => {
  const filtered = useMemo(() => {
    if (!searchText) return data;

    const lower = searchText.toLowerCase();

    return data.filter((item) => {
      const fullName = `${item.name || ""} ${item.last_name || ""}`.toLowerCase();
      const codeMeliStr = String(item.code_meli || "");

      switch (searchField) {
        case "name":
          return fullName.includes(lower);

        case "role":
          return (item.role || "").toLowerCase().includes(lower);

        case "code_meli":
          return codeMeliStr.includes(lower);

        case "all":
        default:
          return (
            fullName.includes(lower) ||
            (item.role || "").toLowerCase().includes(lower) ||
            codeMeliStr.includes(lower)
          );
      }
    });
  }, [data, searchText, searchField]);

  return filtered;
};
