// app/admin/logs/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  User,
  ReplaceAll,
  MessageCircle,
  Calendar,
  Clock as ClockIcon,
  Hash,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';


interface LogEntry {
  id: number;
  uses_id: number;
  action: string;
  message: string;
  date: string;
  time: string;
}

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token')!;
      const res = await axios.get<{ logs: LogEntry[] }>(
        'http://localhost:3001/api/admin/getlogs',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(res.data.logs);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'خطا در دریافت سوابق');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 300_000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 p-4 md:p-6">
      {/* دکمه بازگشت */}
      <Button
        onClick={() => router.push('/admin')}
        variant="outline"
        className="absolute top-0 right-0"
      >
        <ArrowRight size={20} />
      </Button>

      <div className="flex flex-col bg-white border border-gray-200 shadow rounded-lg overflow-hidden h-full">
        {/* هدر صفحه */}
        <div className="p-3 bg-gray-100 border-b">
          <h2 className="text-lg font-semibold text-gray-800">لیست سوابق فعالیت</h2>
        </div>

        {/* لیست سوابق با اسکرول سفارشی */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="mr-2">در حال بارگذاری سوابق...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full p-4 text-center">
              <div className="text-red-500 mb-2">{error}</div>
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                تلاش مجدد
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              لاگی پیدا نشد
            </div>
          ) : (
            <div className="divide-y">
              {/* هدر ردیفی با آیکون (ترتیب: زمان، تاریخ، پیام، عملیات، کاربر، شناسه) */}
              <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 border-b">
                <div className="flex items-center gap-1 justify-end">
                  <ClockIcon className="w-4 h-4 ml-1" />
                  <span>زمان</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="w-4 h-4 ml-1" />
                  <span>تاریخ</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <MessageCircle className="w-4 h-4 ml-1" />
                  <span>پیام</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <ReplaceAll className="w-4 h-4 ml-1" />
                  <span>عملیات</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <User className="w-4 h-4 ml-1" />
                  <span>کاربر</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <Hash className="w-4 h-4 ml-1" />
                  <span>شناسه</span>
                </div>
              </div>

              {/* ردیف‌های دیتا مطابق ترتیب جدید */}
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-6 gap-4 px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="text-right text-gray-500">{log.time}</div>
                  <div className="text-right text-gray-500">{log.date}</div>
                  <div
                    className="text-right text-gray-700 truncate"
                    title={log.message}
                  >
                    {log.message}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full max-w-full truncate">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-right text-gray-800">{log.uses_id}</div>
                  <div className="text-right text-gray-800">{log.id}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
