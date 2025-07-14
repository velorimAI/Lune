'use client';

import { useState } from 'react';
import { UserX, UserPlus, ArrowLeft, UserPen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DeleteUserModal from './components/DeleteUserModal';
import EditUserModal from './components/EditUserModal';
import { getUsersList } from '@/app/apis/admin/adminService';
import { useQuery } from '@tanstack/react-query';
import { useUsersSearch } from '../hooks/useUsersSearch';
import { SearchBox } from '@/app/components/table/search-box';
import { AddUserModal } from './components/add-user-modal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function UsersListPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("all");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersList,
    refetchInterval: 300_000,
  });


  const filteredUsers = useUsersSearch(users, searchText, searchField);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-gray-600 font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">مدیریت کاربران</h1>
              <p className="text-gray-600">مشاهده و مدیریت کاربران سیستم</p>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="ml-2" />
              بازگشت
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">کل کاربران</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center transition hover:shadow-2xl hover:scale-105">
                  <AddUserModal refetch={refetch} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">کاربران آنلاین</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {users.filter((u: { online: any; }) => u.online).length}
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-6 h-6 bg-green-500 rounded-full animate-ping opacity-50 duration-1000 ease-out"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">مدیران</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {users.filter((u: { role: string; }) => u.role === 'مدیریت').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserPen className="text-gray-700" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-[400px]">
            <SearchBox
              searchText={searchText}
              setSearchText={setSearchText}
              searchField={searchField}
              setSearchField={setSearchField}
              className="min-h-[0px] flex-1"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ScrollArea className="w-full pr-3 mt-3 max-h-[55vh] overflow-auto">
            <table dir="rtl" className="w-full">
              <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr className="border-b border-gray-100 ">
                  <th className="text-right p-6 font-medium text-gray-700">کاربر</th>
                  <th className="text-right p-6 font-medium text-gray-700">کد ملی</th>
                  <th className="text-right p-6 font-medium text-gray-700">نقش</th>
                  <th className="text-right p-6 font-medium text-gray-700">آخرین فعالیت</th>
                  <th className="text-center p-6 font-medium text-gray-700">وضعیت</th>
                  <th className="text-center p-6 font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="text-gray-400">
                        <UserX size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">کاربری پیدا نشد</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name} {u.last_name}</p>
                            <p className="text-sm text-gray-500 mt-0.5">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-mono text-gray-700">{u.code_meli}</span>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${u.role === 'مدیریت'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {u.last_active_date || 'نامشخص'}
                          </p>
                          {u.last_active_time && (
                            <p className="text-gray-500 mt-0.5">{u.last_active_time}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center">
                          {u.online ? (
                            <div className="flex items-center gap-2">
                              <div className="relative flex items-center justify-center">
                                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping opacity-50 duration-1000 ease-out"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>

                              <span className="text-xs text-gray-900 font-medium">آنلاین</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                              <span className="text-xs text-gray-500">آفلاین</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-4">
                          <EditUserModal data={u} refetch={refetch} />
                          <DeleteUserModal id={u.id} name={u.name} refetch={refetch} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ScrollBar />
          </ScrollArea>
        </div>

        {/* <div
        className="
        fixed bottom-8 left-8 bg-gray-900 text-white p-4 rounded-xl 
        shadow-lg transition 
        hover:bg-gray-800 hover:shadow-2xl hover:scale-105 
        transform
        cursor-pointer
        "
      >
        <AddUserModal refetch={refetch} />
      </div> */}

      </div>
    </div >
  );
}