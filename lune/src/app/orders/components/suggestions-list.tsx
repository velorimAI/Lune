
interface PartSuggestion {
  technical_code: string;
  part_name: string;
}

interface SuggestionsListProps {
  show: boolean;
  loading: boolean;
  error: string | null;
  suggestions: PartSuggestion[];
  onSelect: (item: PartSuggestion) => void;
  selectedIndex: number;
}

export const SuggestionsList = ({
  show,
  loading,
  error,
  suggestions,
  onSelect,
  selectedIndex,
} : SuggestionsListProps) => {
  if (!show) return null;

  return (
    <div className="absolute top-14 z-10 bg-white border rounded shadow w-full max-h-52 overflow-y-auto">
      {loading && (
        <div className="p-3 text-center text-gray-500 text-sm">
          در حال بارگذاری...
        </div>
      )}

      {error && !loading && (
        <div className="p-3 text-center text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="p-3 text-center text-gray-500 text-sm">
          قطعه‌ای یافت نشد
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <ul>
          {suggestions.map((item, index) => (
            <li
              key={item.technical_code}
              onClick={() => onSelect(item)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                index === selectedIndex
                  ? "bg-blue-100 font-bold"
                  : "hover:bg-blue-50"
              }`}
            >
              <span>{item.technical_code}</span> - {item.part_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
