"use client";

import { forwardRef } from "react";

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

export const SuggestionsList = forwardRef<HTMLDivElement, SuggestionsListProps>(
  ({ show, loading, error, suggestions, onSelect, selectedIndex }, ref) => {
    if (!show) return null;

    const commonClasses =
      "absolute z-10 top-15 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-right text-sm";

    if (loading) {
      return (
        <div ref={ref} className={`${commonClasses} border-gray-300`}>
          در حال بارگذاری...
        </div>
      );
    }

    if (error) {
      return (
        <div ref={ref} className={`${commonClasses} border-red-300 text-red-500`}>
          {error}
        </div>
      );
    }

    if (suggestions.length === 0) {
      return (
        <div ref={ref} className={`${commonClasses} border-gray-300 text-gray-500`}>
          موردی یافت نشد
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="absolute z-10 top-15 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg text-right"
        style={{
          maxHeight: "240px",
          overflowY: "auto",
          scrollBehavior: "auto",
        }}
      >
        {suggestions.map((item, index) => (
          <div
            key={`${item.technical_code}-${index}`}
            className={`p-2 py-1 border-b last:border-b-0 cursor-pointer transition-colors duration-150 ${index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            onClick={() => onSelect(item)}
          >
            <div className="font-medium text-gray-800">{item.technical_code}</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold">
              {item.part_name ? `${item.part_name}` : `— :Name`}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

SuggestionsList.displayName = "SuggestionsList";
