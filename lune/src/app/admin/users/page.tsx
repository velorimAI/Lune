'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import { UserX, UserPlus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AddUserModal from './components/AddUserModal';
import DeleteUserModal from './components/DeleteUserModal';

interface User {
  id: number;
  name: string;
  last_name: string;
  code_meli: number;
  role: string;
  last_active_date: string | null;
  last_active_time: string | null;
  online: boolean;
}

const StatusIndicator = ({ online }: { online: boolean }) => {
  if (online) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
        <div className="w-4 h-4 rounded-full bg-green-500" />
      </div>
    );
  }
  return <div className="w-4 h-4 rounded-full bg-gray-400" />;
};

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [onlineAnimation, setOnlineAnimation] = useState<any>(null);
  const [offlineAnimation, setOfflineAnimation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const API_BASE = 'http://localhost:3001/api/admin';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token')!;
      const res = await axios.get<User[]>(`${API_BASE}/usersstats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در دریافت اطلاعات کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/animations/Online-Pulse-Icon.json')
      .then(r => r.json())
      .then(setOnlineAnimation)
      .catch(() => setOnlineAnimation(null));
    fetch('/animations/Red-Pulse-Dot.json')
      .then(r => r.json())
      .then(setOfflineAnimation)
      .catch(() => setOfflineAnimation(null));

    fetchUsers();
  }, []);

  const handleUserAdded = () => {
    setIsAddModalOpen(false);
    fetchUsers();
    toast.success('لیست کاربران به‌روز شد.');
  };

  const openDelete = (id: number, fullName: string) => {
    setUserToDelete({ id, name: fullName });
    setIsDeleteModalOpen(true);
  };

  const handleUserDeleted = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    fetchUsers();
    toast.success('لیست کاربران به‌روز شد.');
  };

  if (loading) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="relative w-full p-4">
      {/* دکمه برگشت به /admin */}
      <div className="relative mb-4">
        <Button
          onClick={() => router.push("/admin")}
          variant={"outline"}
          className="absolute top-0 right-0 flex items-center text-gray-800 hover:text-gray-1000 transition cursor-pointer"
        >
          <ArrowRight size={20} />
        </Button>
      </div>

      {/* مودال‌ها */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onUserDeleted={handleUserDeleted}
        userId={userToDelete?.id ?? null}
        userName={userToDelete?.name ?? ''}
      />

      {/* جدول کاربران */}
      <div className="w-full max-h-[450px] overflow-y-auto border border-gray-200 rounded-none shadow bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-right border-b border-gray-200">نام</th>
              <th className="p-3 text-right border-b border-gray-200">نام خانوادگی</th>
              <th className="p-3 text-right border-b border-gray-200">کد ملی</th>
              <th className="p-3 text-right border-b border-gray-200">نقش</th>
              <th className="p-3 text-right border-b border-gray-200">آخرین فعالیت</th>
              <th className="p-3 text-center border-b border-gray-200"></th>
              <th className="p-3 text-center border-b border-gray-200">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500 border-b border-gray-200">
                  کاربری پیدا نشد
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-100">{u.name}</td>
                  <td className="p-3 border-b border-gray-100">{u.last_name}</td>
                  <td className="p-3 font-mono border-b border-gray-100">{u.code_meli}</td>
                  <td className="p-3 border-b border-gray-100">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-100">
                    {u.last_active_date
                      ? `${u.last_active_date} ${u.last_active_time}`
                      : 'نامشخص'}
                  </td>
                  <td className="p-3 text-center border-b border-gray-100">
                    {u.online ? (
                      onlineAnimation ? (
                        <Lottie
                          animationData={onlineAnimation}
                          loop
                          autoplay
                          className="w-6 h-6"
                        />
                      ) : (
                        <StatusIndicator online />
                      )
                    ) : offlineAnimation ? (
                      <Lottie
                        animationData={offlineAnimation}
                        loop
                        autoplay
                        className="w-6 h-6"
                      />
                    ) : (
                      <StatusIndicator online={false} />
                    )}
                  </td>
                  <td className="p-3 text-center border-b border-gray-100">
                    <button
                      onClick={() => openDelete(u.id, `${u.name} ${u.last_name}`)}
                      className="text-gray-600 hover:text-red-600"
                      title="حذف"
                    >
                      <UserX size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* دکمه‌ی افزودن شناور */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg border border-gray-300"
        title="افزودن کاربر جدید"
      >
        <UserPlus size={20} />
      </button>
    </div>
  );
}
