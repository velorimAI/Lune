  
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

    if (loading) {
      return (
        <div
          ref={ref}
          className="absolute z-10 top-15 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2"
        >
          در حال بارگذاری...
        </div>
      );
    }

    if (error) {
      return (
        <div
          ref={ref}
          className="absolute z-10 top-15 w-full mt-1 bg-white border border-red-300 rounded-md shadow-lg p-2 text-red-500"
        >
          {error}
        </div>
      );
    }

    if (suggestions.length === 0) {
      return (
        <div
          ref={ref}
          className="absolute z-10 top-15 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500"
        >
          موردی یافت نشد
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="absolute z-10 top-15 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
        style={{ 
          maxHeight: '240px', 
          overflowY: 'auto',
          scrollBehavior: 'auto'
        }}
      >
        {suggestions.map((item, index) => (
          <div
            key={item.technical_code}
            className={`p-2 hover:bg-gray-100 cursor-pointer ${
              index === selectedIndex ? "bg-gray-200" : ""
            }`}
            onClick={() => onSelect(item)}
          >
            <div className="font-medium">{item.technical_code}</div>
            <div className="text-sm text-gray-600">{item.part_name}</div>
          </div>
        ))}
      </div>
    );
  }
);

SuggestionsList.displayName = "SuggestionsList";