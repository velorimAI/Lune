'use client';
import React, { useEffect } from 'react';
import {
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  User,
  Activity,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getLogsList } from '@/app/apis/admin/adminService';
import { getActionStyle } from '../utils/getActionStyle';
import { HotkeyRedirect } from '@/app/components/escape-hot-key';

export default function LogsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['logs'],
    queryFn: getLogsList,
    refetchInterval: 300_000,
  });

  const logs = data?.logs || [];

  useEffect(() => {
    console.log('Logs data:', logs);
  }, [logs]);

  const formatTime = (time: string) => time?.slice(0, 5);

  return (
    <div className="min-h-[92vh] bg-gray-50 p-4 lg:p-8">
      <div className="w-full max-w-full mx-auto">

        <div className="mb-3 flex items-center justify-between">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="h-10 w-10 p-0 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <ArrowRight className="h-6 w-6 text-gray-600" />
          </Button>
          <HotkeyRedirect redirectTo="/admin" />

        </div>


        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
                <div className="w-16 h-16 border-4 border-gray-800 rounded-full animate-spin absolute top-0 left-0 border-t-transparent" />
              </div>
              <p className="mt-6 text-gray-600 text-lg">در حال بارگذاری...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="p-6 bg-red-50 rounded-full mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-gray-900 text-xl font-medium mb-2">خطا در دریافت اطلاعات</p>
              <p className="text-gray-600">لطفاً دوباره تلاش کنید</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="p-6 bg-gray-100 rounded-full mb-6">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">هیچ سابقه‌ای یافت نشد</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-gray-100 text-sm font-medium text-gray-700 border-b border-gray-200">
                <div className="col-span-2 text-right flex items-center gap-2">
                  <User className="h-4 w-4" />
                  نام کاربر
                </div>
                <div className="col-span-2 text-right flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  عملیات
                </div>
                <div className="col-span-2 text-right flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تاریخ و زمان
                </div>
                <div className="col-span-6 text-right">توضیحات</div>
              </div>

              {/* Table Body */}
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div dir="rtl" className="divide-y divide-gray-200">
                  {logs.map((log: any, index: number) => (
                    <div
                      key={log.id}
                      className={`grid grid-cols-12 gap-4 px-8 py-6 transition-all duration-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                    >
                      <div className="col-span-2 text-right">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                            {log.user_name?.[0] || '?'}
                          </div>
                          <span className="text-gray-900 font-medium">{log.user_name}</span>
                        </div>
                      </div>

                      <div className="col-span-2 text-right flex items-center">
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg ${log.action === 'ورود' ? 'bg-green-100 text-green-700 border border-green-200' :
                          log.action === 'خروج' ? 'bg-red-100 text-red-700 border border-red-200' :
                            log.action === 'ویرایش' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              log.action === 'حذف' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                          {log.action}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <div className="text-gray-900 font-medium">{log.date}</div>
                        <div className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(log.time)}
                        </div>
                      </div>

                      <div className="col-span-6 text-right text-gray-700 leading-relaxed">
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