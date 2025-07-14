export const getActionStyle = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('login') || a.includes('ورود')) return 'text-emerald-600 bg-emerald-50';
    if (a.includes('logout') || a.includes('خروج')) return 'text-gray-600 bg-gray-50';
    if (a.includes('error') || a.includes('خطا')) return 'text-red-600 bg-red-50';
    if (a.includes('update') || a.includes('بروزرسانی')) return 'text-amber-600 bg-amber-50';
    if (a.includes('delete') || a.includes('حذف')) return 'text-rose-600 bg-rose-50';
    return 'text-blue-600 bg-blue-50';
};
