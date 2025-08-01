"use client";

interface DealerInfoProps {
    dealerName: string;
    dealerCode: string;
}

export default function DealerInfo({ dealerName, dealerCode }: DealerInfoProps) {
    return (
        <div className="flex items-center gap-4 text-gray-600 text-xs leading-tight">
            <div className="flex flex-col gap-1">
                <span className="font-medium text-white">{dealerName}  {dealerCode}</span>
            </div>
        </div>
    );
}
