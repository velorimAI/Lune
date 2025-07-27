
"use client";

import { FC, useEffect, useState, useCallback, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import { Input } from "@/app/components/custom-form/input";
import { useDebounce } from "@/lib/useDebounce";
import { SuggestionsList } from "./part-suggestions-list";


interface PartSuggestion {
  technical_code: string;
  part_name: string;
}

interface PartIdInputProps {
  value: string;
  onChange: (val: string) => void;
  setPieceName: (name: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const PartIdInput: FC<PartIdInputProps> = ({
  value,
  onChange,
  setPieceName,
  readOnly,
  disabled,
  required
}) => {
  const [suggestions, setSuggestions] = useState<PartSuggestion[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hasSelected, setHasSelected] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 500);

  const scrollToItem = useCallback((index: number) => {
    if (!suggestionsRef.current) return;
    
    const container = suggestionsRef.current;
    const item = container.children[index] as HTMLElement;
    
    container.scrollTop = item.offsetTop - container.offsetHeight / 2 + item.offsetHeight / 2;
  }, []);

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
      if (selectedIndex < suggestions.length - 1) {
        const newIndex = selectedIndex + 1;
        setSelectedIndex(newIndex);
        scrollToItem(newIndex);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedIndex > 0) {
        const newIndex = selectedIndex - 1;
        setSelectedIndex(newIndex);
        scrollToItem(newIndex);
      }
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
        required={required}
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
};