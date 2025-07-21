import { FC } from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabCounts: Record<string, number>;
}

export const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab, tabCounts }) => {
  const tabs = [
    
    { label: `در انتظار تایید شرکت`, value: "در انتظار تائید شرکت" },
    { label: `در انتظار تایید حسابداری`, value: "در انتظار تائید حسابداری" },
    { label: `در انتظار دریافت`, value: "در انتظار دریافت" },
    { label: `دریافت شده`, value: "دریافت شد" },
    { label: `در انتظار نوبت‌دهی`, value: "در انتظار نوبت‌دهی" },
    { label: `نوبت داده شد`, value: "نوبت داده شد" },
    { label: "لغو شده", value: "canceled" },
    { label: `تحویل شده`, value: "تحویل شد" },
    { label: `همه سفارش‌ها`, value: "all" },
  ];

  return (
    <div className="flex gap-1 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`
            group relative px-3 py-1 text-sm font-medium transition-colors duration-300 ease-in-out
            ${
              activeTab === tab.value
                ? "text-primary"
                : "text-gray-500 hover:text-primary"
            }
          `}
        >
          {tab.label} ({tabCounts[tab.value] || 0})
          <span
            className={`
              absolute left-0 -bottom-[2px] h-[2px] bg-primary transition-all duration-300 ease-in-out
              ${
                activeTab === tab.value
                  ? "w-full opacity-100 scale-x-100"
                  : "w-full opacity-30 scale-x-90"
              }
            `}
          />
        </button>
      ))}
    </div>
  );
};
