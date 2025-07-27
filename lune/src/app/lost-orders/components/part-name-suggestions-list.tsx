"use client";

import { forwardRef } from "react";

interface PartNameSuggestion {
    part_id: string;
    piece_name: string;
}

interface PartNameSuggestionsListProps {
    show: boolean;
    loading: boolean;
    error: string | null;
    suggestions: PartNameSuggestion[];
    onSelect: (item: PartNameSuggestion) => void;
    selectedIndex: number;
}

export const PartNameSuggestionsList = forwardRef<
    HTMLDivElement,
    PartNameSuggestionsListProps
>(({ show, loading, error, suggestions, onSelect, selectedIndex }, ref) => {
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
                    key={`${item.part_id}-${index}`}
                    className={`p-2 py-1 border-b last:border-b-0 cursor-pointer transition-colors duration-150 ${index === selectedIndex ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                    onClick={() => onSelect(item)}
                >
                    <div className="font-medium text-gray-800">{item.piece_name}</div>
                    <div className="text-xs text-gray-500 mt-1 font-semibold">
                        {item.part_id ? `Part ID: ${item.part_id}` : `-  :Part ID`}
                    </div>
                </div>
            ))}
        </div>
    );
});

PartNameSuggestionsList.displayName = "PartNameSuggestionsList";
