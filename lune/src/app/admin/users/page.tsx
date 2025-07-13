// pages/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import { UserX, UserPlus, ArrowRight, UserPen } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AddUserModal from './components/AddUserModal';
import DeleteUserModal from './components/DeleteUserModal';
import EditUserModal from './components/EditUserModal';

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

const API_BASE = 'http://localhost:3001/api/admin';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // تابع بارگذاری لیست کاربران
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')!;
      const res = await axios.get<User[]>(`${API_BASE}/usersstats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در دریافت اطلاعات کاربران');
    } finally {
      setLoading(false);
    }
  };

  // یک‌بار هنگام مونت شدن صفحه، انیمیشن‌ها را لود و اولین fetch را انجام بده
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

  // Polling برای بروزرسانی لیست کاربران هر 5 دقیقه
  useEffect(() => {
    const intervalId = setInterval(fetchUsers, 300_000); // 300,000ms = 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  // هندلرهای CRUD که پس از اجرا، مجدداً لیست را می‌خوانند
  const handleUserAdded = () => {
    setIsAddModalOpen(false);
    fetchUsers();
    toast.success('لیست کاربران به‌روز شد.');
  };
  const handleUserDeleted = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    fetchUsers();
    toast.success('لیست کاربران به‌روز شد.');
  };
  const handleUserEdited = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
    fetchUsers();
    toast.success('لیست کاربران به‌روز شد.');
  };

  const openDelete = (id: number, fullName: string) => {
    setUserToDelete({ id, name: fullName });
    setIsDeleteModalOpen(true);
  };
  const openEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  if (loading) return <div className="p-4 text-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="relative w-full p-4">
      <Button
        onClick={() => router.push('/admin')}
        variant="outline"
        className="absolute top-0 right-0"
      >
        <ArrowRight size={20} />
      </Button>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onUserDeleted={handleUserDeleted}
        userId={userToDelete?.id || null}
        userName={userToDelete?.name || ''}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={userToEdit}
        onUserEdited={handleUserEdited}
      />

      <div className="w-full max-h-[450px] overflow-y-auto border border-gray-200 shadow bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-right border-b">نام</th>
              <th className="p-3 text-right border-b">نام خانوادگی</th>
              <th className="p-3 text-right border-b">کد ملی</th>
              <th className="p-3 text-right border-b">نقش</th>
              <th className="p-3 text-right border-b">آخرین فعالیت</th>
              <th className="p-3 text-center border-b"></th>
              <th className="p-3 text-center border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500 border-b">
                  کاربری پیدا نشد
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.last_name}</td>
                  <td className="p-3 font-mono">{u.code_meli}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'مدیریت'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.last_active_date
                      ? `${u.last_active_date} ${u.last_active_time}`
                      : 'نامشخص'}
                  </td>
                  <td className="p-3 text-center">
                    {u.online ? (
                      onlineAnimation ? (
                        <Lottie animationData={onlineAnimation} loop autoplay className="w-6 h-6" />
                      ) : (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                          <div className="w-4 h-4 rounded-full bg-green-500" />
                        </div>
                      )
                    ) : offlineAnimation ? (
                      <Lottie animationData={offlineAnimation} loop autoplay className="w-6 h-6" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-gray-600 hover:text-blue-600 mx-1"
                      title="ویرایش"
                    >
                      <UserPen size={20} />
                    </button>
                    <button
                      onClick={() => openDelete(u.id, `${u.name} ${u.last_name}`)}
                      className="text-gray-600 hover:text-red-600 mx-1"
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

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        title="افزودن کاربر جدید"
      >
        <UserPlus size={20} />
      </button>
    </div>
  );
}
