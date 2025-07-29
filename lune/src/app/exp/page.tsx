'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Diamond, Sparkles, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const toPersianDigits = (str: string) => {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

interface Plan {
    title: string;
    description: string;
    features: string[];
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
}

const plans: Plan[] = [
    {
        title: 'برنز',
        description: 'مناسب برای شروع',
        features: [
            'دسترسی پایه به محتوا',
            'پشتیبانی عمومی انجمنی',
        ],
        icon: Zap,
        accentColor: 'from-orange-400 to-amber-500',
    },
    {
        title: 'نقره‌ای',
        description: 'تجربه ی کامل',
        features: [
            'همه ویژگی‌های برنز',
            'پشتیبانی ایمیلی اولویت‌دار',
            'دسترسی به محتوای اختصاصی',
        ],
        icon: Diamond,
        accentColor: 'from-slate-400 to-gray-500',
    },
    {
        title: 'طلایی',
        description: 'بهترین انتخاب',
        features: [
            'همه ویژگی‌های نقره‌ای',
            'داشبورد تحلیلی پیشرفته',
            'پشتیبانی اختصاصی و آموزش',
        ],
        icon: Sparkles,
        accentColor: 'from-yellow-400 to-amber-500',
    },
];

export default function ExpPage() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        onClick={() => router.push("/admin")}
                        variant="outline"
                        className="text-center content-center"
                    >
                        <ArrowRight size={26} />
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => {
                        const IconComponent = plan.icon;

                        return (
                            <div
                                key={plan.title}
                                className={`
                                    group transform transition-all duration-700 ease-out
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                                    hover:scale-[1.03] hover:-translate-y-3
                                `}
                                style={{
                                    transitionDelay: `${index * 200}ms`,
                                }}
                            >
                                <div className="relative h-full bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm hover:shadow-2xl hover:border-gray-300/60 transition-all duration-500 overflow-hidden">
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${plan.accentColor}`} />
                                    <div className="p-8 h-full flex flex-col">
                                        <div className="text-center mb-8">
                                            <div className="relative mb-6">
                                                <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${plan.accentColor} flex items-center justify-center shadow-sm`}>
                                                        <IconComponent
                                                            size={22}
                                                            className="text-white drop-shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                                {plan.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 font-medium bg-gray-100/60 px-4 py-2 rounded-full inline-block">
                                                {toPersianDigits(plan.description)}
                                            </p>
                                        </div>
                                        <div className="flex-1 space-y-5">
                                            {plan.features.map((feat, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start animate-fadeIn group/item"
                                                    style={{ animationDelay: `${400 + idx * 150}ms` }}
                                                >
                                                    <div className="flex-shrink-0 mt-2 ml-4">
                                                        <div className="w-2 h-2 rounded-full bg-gray-400 group-hover/item:bg-gray-600 transition-colors duration-200" />
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200 font-medium">
                                                        {feat}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                        <div className={`w-full h-full bg-gradient-to-br ${plan.accentColor} rounded-full blur-3xl`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                * {
                    font-family: 'Inter', 'Vazirmatn', system-ui, -apple-system, sans-serif;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}