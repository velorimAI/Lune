import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePartSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["part-suggestions", query],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3001/api/orders/partname-suggest/${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    enabled: query.length >= 2, 
    staleTime: 1000 * 60 * 5, 
  });
};
