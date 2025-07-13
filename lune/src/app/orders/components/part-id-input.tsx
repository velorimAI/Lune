"use client";

import {
  FC,
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios, { CancelTokenSource } from "axios";
import { Input } from "@/app/components/custom-form/input";
import { useDebounce } from "@/lib/useDebounce";

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

export type InputRefHandle = {
  clear: () => void;
};

const SuggestionsList = forwardRef<HTMLDivElement, SuggestionsListProps>(
  ({ show, loading, error, suggestions, onSelect, selectedIndex }, ref) => {
    if (!show) return null;

    if (loading) {
      return (
        <div
          ref={ref}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2"
        >
          در حال بارگذاری...
        </div>
      );
    }

    if (error) {
      return (
        <div
          ref={ref}
          className="absolute z-10 w-full mt-1 bg-white border border-red-300 rounded-md shadow-lg p-2 text-red-500"
        >
          {error}
        </div>
      );
    }

    if (suggestions.length === 0) {
      return (
        <div
          ref={ref}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500"
        >
          موردی یافت نشد
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="absolute z-10 top-15 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
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

interface PartIdInputProps {
  value: string;
  onChange: (val: string) => void;
  setPieceName: (name: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

// 👇 forwardRef برای ریفرنس‌دهی بیرونی و expose متد
export const PartIdInput = forwardRef<InputRefHandle, PartIdInputProps>(
  ({ value, onChange, setPieceName, readOnly, disabled }, ref) => {
    const [suggestions, setSuggestions] = useState<PartSuggestion[]>([]);
    const [showList, setShowList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [hasSelected, setHasSelected] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const debouncedValue = useDebounce(value, 500);

    const scrollIntoView = (index: number) => {
      if (suggestionsRef.current && suggestionsRef.current.children[index]) {
        suggestionsRef.current.children[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        onChange("");
        setPieceName("");
        setSuggestions([]);
        setShowList(false);
        setSelectedIndex(-1);
        setHasSelected(false);
      },
    }));

    useEffect(() => {
      if (hasSelected) return;
      if (!debouncedValue || debouncedValue.length < 5) {
        setSuggestions([]);
        setShowList(false);
        setLoading(false);
        setError(null);
        return;
      }

      let cancelToken: CancelTokenSource;
      const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        cancelToken = axios.CancelToken.source();

        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:3001/api/orders/suggest-parts?q=${debouncedValue}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cancelToken: cancelToken.token,
            }
          );
          setSuggestions(res.data);
          setShowList(true);
        } catch (err) {
          if (axios.isCancel(err)) return;
          setError("خطا در دریافت پیشنهادها");
          setSuggestions([]);
          setShowList(true);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();

      return () => {
        if (cancelToken) cancelToken.cancel();
      };
    }, [debouncedValue, hasSelected]);

    const handleSelect = useCallback(
      (item: PartSuggestion) => {
        onChange(item.technical_code);
        setPieceName(item.part_name);
        setShowList(false);
        setSuggestions([]);
        setSelectedIndex(-1);
        setHasSelected(true);
      },
      [onChange, setPieceName]
    );

    const handleChange = (val?: string) => {
      if (val !== undefined) {
        onChange(val);
        setShowList(val.length >= 5);
        setSelectedIndex(-1);
        setHasSelected(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!showList || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const newIndex =
          selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(newIndex);
        scrollIntoView(newIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newIndex =
          selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1;
        setSelectedIndex(newIndex);
        scrollIntoView(newIndex);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      }
    };

    return (
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="relative focus:outline-none"
      >
        <Input
          label="کد فنی"
          name="part_id"
          value={value}
          onChange={handleChange}
          required
          readOnly={readOnly}
          disabled={disabled}
          clearable
        />

        <SuggestionsList
          show={showList}
          loading={loading}
          error={error}
          suggestions={suggestions}
          onSelect={handleSelect}
          selectedIndex={selectedIndex}
          ref={suggestionsRef}
        />
      </div>
    );
  }
);

PartIdInput.displayName = "PartIdInput";
