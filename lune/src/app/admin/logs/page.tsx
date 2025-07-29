'use client';
import React, { useEffect } from 'react';
import {
  MessageCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getLogsList } from '@/app/apis/admin/adminService';
import { getActionStyle } from '../utils/getActionStyle';

export default function LogsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['logs'],
    queryFn: getLogsList,
    refetchInterval: 300_000,
  });

  const logs = data?.logs || [];

  // ورود داده‌ها به کنسول برای دیباگ
  useEffect(() => {
    console.log('Logs data:', logs);
  }, [logs]);

  const formatTime = (time: string) => time?.slice(0, 5);



  return (
    <div className="bg-gray-50 p-2">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="text-center content-center"
          >
            <ArrowRight size={26} />
          </Button>
        </div>


        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-gray-200 rounded-full" />
                <div className="w-14 h-14 border-4 border-gray-700 rounded-full animate-spin absolute top-0 left-0 border-t-transparent" />
              </div>
              <p className="mt-4 text-gray-500 text-sm">در حال بارگذاری...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="p-4 bg-red-50 rounded-full mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-gray-700 font-medium mb-2">خطا در دریافت اطلاعات</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <MessageCircle className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">هیچ سابقه‌ای یافت نشد</p>
            </div>
          ) : (
            <>

              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600 border-b border-gray-200">
                <div className="col-span-2 text-right">نام کاربر</div>
                <div className="col-span-2 text-right">عملیات</div>
                <div className="col-span-2 text-right">تاریخ و زمان</div>
                <div className="col-span-6 text-right">توضیحات</div>
              </div>


              <ScrollArea className="h-[calc(100vh-320px)]">
                <div dir="rtl" className="divide-y divide-gray-100">
                  {logs.map((log: any) => (
                    <div key={log.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-150"
                    >
                      <div className="col-span-2 text-right text-sm text-gray-700">
                        {log.user_name}
                      </div>


                      <div className="col-span-2 text-right">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getActionStyle(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm">
                        <div className="text-gray-700">{log.date}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatTime(log.time)}</div>
                      </div>
                      <div className="col-span-6 text-right text-sm text-gray-600 leading-relaxed">
                        {log.message}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
