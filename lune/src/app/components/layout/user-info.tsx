'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

type UserData = {
    name: string;
    lastname: string;
    role: string;
};

const UserInfo = () => {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const name = localStorage.getItem('name');
            const lastname = localStorage.getItem('lastname');
            const role = localStorage.getItem('role');

            if (name && lastname && role) {
                setUser({ name, lastname, role });
            }
        }
    }, []);

    if (!user) return <p className="text-sm text-gray-500">در حال بارگذاری...</p>;

    return (
        <div className="text-sm text-right flex items-center gap-2">
            <User className="w-6 h-6 text-gray-600" />
            <p>
                {user.name} {user.lastname} (<span className="text-gray-600">{user.role}</span>)
            </p>
        </div>
    );
};

export default UserInfo;