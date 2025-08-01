"use client";

import {useCallback, useRef, useEffect, useState } from "react";
import { Input } from "@/app/components/custom-form/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { PartNameSuggestionsList } from "./part-name-suggestions-list";
import { usePartSuggestions } from "../hooks";

interface PartSuggestion {
  piece_name: string;
  part_id: string;
}

interface PartNameInputProps {
  value: string;
  onChange: (val: string) => void;
  setPieceName: (name: string, partId?: string) => void;
  setHasSelected?: (val: boolean) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const PartNameInput = ({
  value,
  onChange,
  setPieceName,
  setHasSelected,
  readOnly,
  disabled,
} : PartNameInputProps) => {
  const [showList, setShowList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSelected, _setHasSelected] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebounce(value, 500);

  const {
    data: suggestions = [],
    isLoading,
    error,
  } = usePartSuggestions(debouncedValue);

  useEffect(() => {
    if (hasSelected || debouncedValue.length < 2) {
      setShowList(false);
      setSelectedIndex(-1);
      return;
    }
    setShowList(suggestions.length > 0);
  }, [debouncedValue, suggestions, hasSelected]);

  const scrollToItem = useCallback((index: number) => {
    const container = suggestionsRef.current;
    const item = container?.children[index] as HTMLElement;
    if (container && item) {
      container.scrollTop =
        item.offsetTop - container.offsetHeight / 2 + item.offsetHeight / 2;
    }
  }, []);

  const handleSelect = useCallback(
    (item: PartSuggestion) => {
      onChange(item.part_id);
      setPieceName(item.piece_name, item.part_id);
      setShowList(false);
      setSelectedIndex(-1);
      setHasSelected?.(true);
      _setHasSelected(true);
    },
    [onChange, setPieceName, setHasSelected]
  );

  const handleChange = (val?: string) => {
    if (val !== undefined) {
      onChange(val);
      setHasSelected?.(false);
      _setHasSelected(false);
      setSelectedIndex(-1);
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
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelect(suggestions[selectedIndex]);
      } else {
        setShowList(false);
        const form = containerRef.current?.closest("form");
        const inputs = form?.querySelectorAll<HTMLElement>("input, select, textarea, button, [tabindex]");
        const index = Array.from(inputs || []).indexOf(containerRef.current!);
        if (index > -1 && inputs && index + 1 < inputs.length) {
          inputs[index + 1]?.focus();
        }
      }
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
        label="نام قطعه"
        name="piece_name"
        value={value}
        onChange={handleChange}
        required
        readOnly={readOnly}
        disabled={disabled}
        clearable
      />

      <PartNameSuggestionsList
        show={showList}
        loading={isLoading}
        error={error ? "خطا در دریافت پیشنهادها" : null}
        suggestions={suggestions}
        onSelect={handleSelect}
        selectedIndex={selectedIndex}
        ref={suggestionsRef}
      />
    </div>
  );
};
