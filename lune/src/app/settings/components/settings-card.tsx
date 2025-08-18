import { Input } from "@/app/components/custom-form/input";
import { LucideIcon } from "lucide-react";

interface SettingsCardProps {
  title: string;
  name: string;
  icon: LucideIcon;
  value?: string;
  isPending?: boolean;
}

export const SettingsCard = ({
  title,
  name,
  icon: Icon,
  value,
  isPending = false
}: SettingsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon className="text-gray-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>

      <Input
        label="تعداد روز رسیدن"
        name={name}
        type="number"
        placeholder="0"
        value={value}
        disabled={isPending}
        className="border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 rounded-lg transition-all duration-200"
        inputClassName="w-full 
          [appearance:textfield] 
          [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
        min={1}
        max={99}
      />
    </div>
  );
};
