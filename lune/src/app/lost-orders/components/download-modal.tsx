'use client';

import { Modal } from '@/app/components/modal';
import { DownloadLostOrders } from './download-lost-order';
import { useState } from 'react';
import { Download } from 'lucide-react';
import { JalaliDatePicker } from '@/app/components/custom-form/date-picker';

export const DownloadModal = () => {
    const [open, setOpen] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    return (
        <>
            <div onClick={() => setOpen(true)}>
                <Download className="text-gray-700 hover:text-purple-600" />
            </div>

            <Modal
                open={open}
                title="دانلود قطعات از دست رفته"
                hideCancel
                hideConfirm
                contentClassName="pb-2"
                onCancel={() => setOpen(false)}
            >
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                        <JalaliDatePicker
                            label="از تاریخ"
                            name="fromDate"
                            value={fromDate}
                            onChange={setFromDate}
                            required
                        />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <JalaliDatePicker
                            label="تا تاریخ"
                            name="toDate"
                            value={toDate}
                            onChange={setToDate}
                            required
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <DownloadLostOrders fromDate={fromDate} toDate={toDate} />
                    {/* <DownloadLostOrders fromDate='1404/05/01' toDate='1404/05/30' /> */}
                </div>
            </Modal>
        </>
    );
};
