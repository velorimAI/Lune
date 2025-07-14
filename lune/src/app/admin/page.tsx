'use client';

import { useRouter } from 'next/navigation';
import { Users, FileClock, PackagePlus } from 'lucide-react';


export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex flex-1 justify-center items-center gap-12">
        <div
          onClick={() => router.push('/admin/users')}
          className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 cursor-pointer
                     hover:border-blue-500 hover:bg-blue-50 transition-colors duration-300
                     w-48 min-h-[160px]"
        >
          <Users size={64} className="text-gray-700 hover:text-blue-600" />
          <span className="mt-4 text-gray-700 font-semibold text-center">کاربران</span>
        </div>

        <div
          onClick={() => router.push('/admin/logs')}
          className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 cursor-pointer
                     hover:border-green-500 hover:bg-green-50 transition-colors duration-300
                     w-48 min-h-[160px]"
        >
          <FileClock size={64} className="text-gray-700 hover:text-green-600" />
          <span className="mt-4 text-gray-700 font-semibold text-center">سوابق فعالیت</span>
        </div>

        <div
          onClick={() => router.push('/orders/new')}
          className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 cursor-pointer
                     hover:border-purple-500 hover:bg-purple-50 transition-colors duration-300
                     w-48 min-h-[160px]"
        >
          <PackagePlus size={64} className="text-gray-700 hover:text-purple-600" />
          <span className="mt-4 text-gray-700 font-semibold text-center">افزودن سفارش</span>
        </div>
      </main>
    </div>
  );
}