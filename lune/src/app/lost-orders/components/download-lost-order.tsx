'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadLostOrdersReport } from '@/app/apis/lost-orders/lostOrdersService';
import { DropDownMenu } from '@/app/components/drop-down-menu';

type Props = {
  fromDate: string;
  toDate: string;
};

export const DownloadLostOrders = ({ fromDate, toDate }: Props) => {
  const handleDownload = (format: 'excel' | 'csv') => {
    downloadLostOrdersReport(format, fromDate, toDate);
  };

  return (
    <DropDownMenu
      trigger={
        <Button variant="outline" className="gap-2">
          دانلود گزارش
          <Download size={16} />
        </Button>
      }
      items={[
        {
          title: 'Excel',
          onClick: () => handleDownload('excel'),
          icon: <Download size={14} />,
        },
        {
          title: 'CSV',
          onClick: () => handleDownload('csv'),
          icon: <Download size={14} />,
        },
      ]}
    />
  );
};
