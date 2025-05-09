"use client";

import { FC, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";
import { Input } from "../custom-form/input";

export type SearchBoxProps = {
  className?: string;
  onSearch?: (value?: string) => void;
  disabled?: boolean;
  clearable?: boolean;
  placeholderSearch?: string;
};

export const SearchBox: FC<SearchBoxProps> = (props) => {
  const {
    className,
    onSearch,
    disabled,
    placeholderSearch = "جستجو ...",
  } = props;

  const [searchState, setSearchState] = useState<string>("");

  const handleDebounceFn = (value: string) => {
    onSearch?.(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(debounce(handleDebounceFn, 700), []);

  const handleInputChange = (value?: string) => {
    setSearchState(value || "");
    debounceFn(value || "");
  };

  return (
    <Input
      placeholder={placeholderSearch}
      value={searchState}
      onChange={handleInputChange}
      disabled={disabled}
      className={cn("w-full", className)}
      clearable
    />
  );
};
