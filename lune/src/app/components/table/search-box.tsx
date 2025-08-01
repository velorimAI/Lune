"use client";

import { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { cn } from "@/app/utils/cn";
import { Input } from "../custom-form/input";
import { Select } from "../custom-form/select-box";

export type SearchBoxProps = {
  className?: string;
  onSearch?: (value?: string) => void;
  disabled?: boolean;
  clearable?: boolean;
  placeholderSearch?: string;
  searchText?: string;
  setSearchText?: (value: string) => void;
  searchField?: string;
  setSearchField?: (value: string) => void;
};

export const SearchBox = ({
  className,
  onSearch,
  disabled,
  placeholderSearch = "جستجو ...",
  searchText,
  setSearchText,
  searchField,
  setSearchField,
}: SearchBoxProps) => {
  const [internalSearch, setInternalSearch] = useState(searchText || "");

  useEffect(() => {
    setInternalSearch(searchText || "");
  }, [searchText]);

  // ✅ ایجاد debounce تابع جستجو
  const debounceFn = useMemo(
    () =>
      debounce((value: string) => {
        onSearch?.(value);
        setSearchText?.(value);
      }, 500),
    [onSearch, setSearchText]
  );

  // ✅ پاک‌سازی debounce در هنگام unmount
  useEffect(() => {
    return () => {
      debounceFn.cancel();
    };
  }, [debounceFn]);

  const handleInputChange = (value?: string) => {
    const val = value || "";
    setInternalSearch(val);
    debounceFn(val);
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <Input
        placeholder={placeholderSearch}
        value={internalSearch}
        onChange={handleInputChange}
        disabled={disabled}
        className="flex-1 min-h-[0px]"
        clearable
      />

      {setSearchField && (
        <Select
          value={searchField}
          onChange={setSearchField}
          options={[
            { label: "همه", value: "all" },
            { label: "نام", value: "name" },
            { label: "کد ملی", value: "code_meli" },
            { label: "نقش", value: "role" },
          ]}
          className="min-h-[0px] mt-2"
        />
      )}
    </div>
  );
};
