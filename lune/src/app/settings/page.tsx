"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/button";
import { Input } from "../components/custom-form/input";
import { Form } from "../components/custom-form/form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { 
  Settings, 
  Package, 
  Clock, 
  Store, 
  TrendingUp, 
  Warehouse,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { getSettings, SettingResponse, updateSettings } from "../apis/setting/settingService";

const ORDER_TYPES = [
  { value: "VOR", label: "سفارش VOR (فوری)" },
  { value: "VIS", label: "سفارش VIS (عادی)" },
] as const;

const SETTING_FIELDS = [
  { key: "market", label: "بازار", placeholder: "مثال: 15" },
  { key: "warhouse_charge", label: "شارژ انبار", placeholder: "مثال: 5" },
] as const;

type OrderType = (typeof ORDER_TYPES)[number]["value"];
type SettingField = (typeof SETTING_FIELDS)[number]["key"];

interface SettingData {
  VOR: string;
  VIS: string;
  market: string;
  warhouse_charge: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingData>({
    VOR: "7",
    VIS: "10",
    market: "",
    warhouse_charge: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error'>('connected');

  // دریافت تنظیمات از سرور
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("لطفاً ابتدا وارد شوید");
        setConnectionStatus('error');
        return;
      }

      const data: SettingResponse = await getSettings();
      setConnectionStatus('connected');
      
      setSettings({
        VOR: data.VOR || "7",
        VIS: data.VIS || "10",
        market: data.market || "",
        warhouse_charge: data.warhouse_charge || "",
      });

    } catch (error: unknown) {
      console.error("خطا در دریافت تنظیمات:", error);
      setConnectionStatus('error');
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response?.status === 401) {
          toast.error("احراز هویت ناموفق. لطفاً مجدداً وارد شوید");
          return;
        }
        
        if (axiosError.response?.status === 404) {
          toast.error("سرور در دسترس نیست");
          return;
        }

        const errorMessage = (axiosError.response?.data as SettingResponse)?.message || 
                           axiosError.message || 
                           "خطای سرور";
        toast.error(errorMessage);
        
      } else {
        const errorMessage = error instanceof Error ? error.message : "خطا در دریافت تنظیمات";
        toast.error(errorMessage);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // بروزرسانی تنظیمات
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("لطفاً ابتدا وارد شوید");
        return;
      }

      const result: SettingResponse = await updateSettings(settings);
      toast.success(result.message || "تنظیمات با موفقیت ذخیره شد");
      
    } catch (error: unknown) {
      console.error("خطا در ذخیره تنظیمات:", error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response?.status === 401) {
          toast.error("احراز هویت ناموفق. لطفاً مجدداً وارد شوید");
          return;
        }

        const errorMessage = (axiosError.response?.data as SettingResponse)?.message || 
                           axiosError.message || 
                           "خطای سرور";
        toast.error(errorMessage);
        
      } else {
        const errorMessage = error instanceof Error ? error.message : "خطا در ذخیره تنظیمات";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // تغییر مقادیر
  const handleChange = (key: keyof SettingData, value: string) => {
    if (value.length > 2) {
      toast.error("حداکثر 2 کاراکتر مجاز است");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Status indicator component
  const StatusIndicator = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">متصل</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">خطا</span>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <span className="text-gray-700 font-medium">در حال بارگذاری...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-gray-700" />
              <h1 className="text-xl font-bold text-gray-900">
                تنظیمات سیستم
              </h1>
            </div>
            <StatusIndicator />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-120px)] overflow-y-auto bg-gray-50">
          {connectionStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">خطا در اتصال به سرور</span>
              </div>
              <p className="text-red-700 text-sm mt-2">
                لطفاً اتصال اینترنت و وضعیت سرور را بررسی کنید
              </p>
              <button
                onClick={fetchSettings}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          <Form
            onSubmit={handleSubmit}
            submitText={loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            cancelText="لغو"
            className="space-y-6"
          >
            {/* بخش تنظیمات سفارشات */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-300">
                <Package className="h-6 w-6 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  تنظیمات روز دریافت قطعه
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ORDER_TYPES.map((type) => (
                  <div
                    key={type.value}
                    className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {type.value === 'VOR' ? (
                        <Zap className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600" />
                      )}
                      <p className="text-sm font-semibold text-gray-800">{type.label}</p>
                    </div>
                    <Input
                      name={`${type.value}-day-count`}
                      label="تعداد روز"
                      type="text"
                      value={settings[type.value]}
                      onChange={(val?: string) => handleChange(type.value, val || "")}
                      placeholder="مثال: 7"
                      disabled={loading || connectionStatus === 'error'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* بخش تنظیمات عمومی */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-3">
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SETTING_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {field.key === 'market' ? (
                        <TrendingUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Warehouse className="h-5 w-5 text-gray-600" />
                      )}
                      <p className="text-sm font-semibold text-gray-800">{field.label}</p>
                    </div>
                    <Input
                      name={field.key}
                      label={field.label}
                      type="text"
                      value={settings[field.key]}
                      onChange={(val?: string) => handleChange(field.key, val || "")}
                      placeholder={field.placeholder}
                      disabled={loading || connectionStatus === 'error'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* نمایش وضعیت */}
            {loading && (
              <div className="flex items-center justify-center space-x-3 py-4 bg-white rounded-lg border border-gray-300">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">
                  در حال ذخیره تغییرات...
                </span>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}