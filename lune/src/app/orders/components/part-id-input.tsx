import { useEffect, useState, useCallback } from "react";
import axios, { CancelTokenSource } from "axios";
import { Input } from "@/app/components/custom-form/input";

interface PartSuggestion {
  technical_code: string;
  part_name: string;
}

interface PartIdInputProps {
  value: string;
  onChange: (val: string) => void;
  setPieceName: (name: string) => void;
  readOnly?: boolean;
}

export const useDebounce = (value: string, delay = 500): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const PartIdInput = ({
  value,
  onChange,
  setPieceName,
  readOnly,
}: PartIdInputProps) => {
  const [suggestions, setSuggestions] = useState<PartSuggestion[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
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
  }, [debouncedValue]);

  const handleSelect = useCallback(
    (item: PartSuggestion) => {
      onChange(item.technical_code);
      setPieceName(item.part_name);
      setShowList(false);
    },
    [onChange, setPieceName]
  );

  const handleChange = (val?: string) => {
    if (val !== undefined) {
      onChange(val);
      if (val.length >= 5) {
        setShowList(true);
      } else {
        setShowList(false);
      }
    }
  };

  return (
    <div className="relative">
      <Input
        label="کد فنی"
        name="part_id"
        value={value}
        onChange={handleChange}
        required
        readOnly={readOnly}
        clearable
      />

      {showList && (
        <div className="absolute top-14 z-10 bg-white border rounded shadow w-full max-h-52 overflow-y-auto">
          {loading && (
            <div className="p-3 text-center text-gray-500 text-sm">در حال بارگذاری...</div>
          )}

          {error && !loading && (
            <div className="p-3 text-center text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <div className="p-3 text-center text-gray-500 text-sm">قطعه‌ای یافت نشد</div>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <ul>
              {suggestions.map((item) => (
                <li
                  key={item.technical_code}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100 text-sm"
                >
                  <span className="font-bold">{item.technical_code}</span> - {item.part_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
