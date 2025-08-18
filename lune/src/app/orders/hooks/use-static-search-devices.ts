import { useMemo } from 'react';

export const useStaticSearchDevices = (
  devices: Record<any, any>[] = [],
  text: string = '',
  status: string = ''
) => {
  return useMemo(() => {
    const trimmedStatus = status === 'all' ? '' : status.trim();
    const trimmedText = text.trim();

    if (!devices) return [];

    return devices.filter((item) => {
      const matchesSearch = [item?.customer_name , item?.reception_number, item?.customer_phone].some(
        (field) =>
          field !== undefined &&
          field !== null &&
          String(field).includes(trimmedText)
      );

      const matchesStatus =
        status === 'all' ||
        trimmedStatus === '' ||
        item.availability_status === trimmedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [devices, text, status]);
};
