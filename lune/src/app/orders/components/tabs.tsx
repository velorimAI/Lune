import { FC } from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabCounts: Record<string, number>;
}

export const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    { label: `همه سفارش‌ها (${tabCounts.all || 0})`, value: "all" },
    { label: `تسویه نشده (${tabCounts.notSettled || 0})`, value: "تسویه نشده" },
    { label: `تسویه شده (${tabCounts.settled || 0})`, value: "تسویه شده" },
    { label: `لغو شده (${tabCounts.canceled || 0})`, value: "لغو شده" },
    { label: `ارشیو (${tabCounts.all || 0})`, value: "ارشیو" },
  ];

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`group relative px-3 py-1 text-sm font-medium transition-colors duration-300 ease-in-out
            ${activeTab === tab.value ? "text-primary" : "text-gray-500 hover:text-primary"}
          `}
        >
          {tab.label}
          <span
            className={`absolute left-0 -bottom-[2px] h-[2px] bg-primary transition-all duration-300 ease-in-out
              ${activeTab === tab.value ? "w-full opacity-100 scale-x-100" : "w-full opacity-30 scale-x-90 "}
            `}
          />
        </button>
      ))}
    </div>
  );
};
