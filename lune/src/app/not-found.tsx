'use client';

import NotFoundIcon from './components/layout/not-found-icon';
import { Button } from './components/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="max-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-2xl text-center">
                <div className="flex items-center justify-center">
                    <NotFoundIcon />
                </div>

                <div className='flex justify-center items-center flex-col'>
                    <p className="text-gray-800 mb-6 font-semibold">
                        متأسفیم! آدرسی که وارد کرده‌اید در این سایت وجود ندارد.
                    </p>
                   

                        <Button
                            onClick={() => router.push('/orders')}
                            className='w-[200px]'
                        >
                            بازگشت به صفحه اصلی
                        </Button>
   
                </div>

            </div>
        </div>
    );
}
