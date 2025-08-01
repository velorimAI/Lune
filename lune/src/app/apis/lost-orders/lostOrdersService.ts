import apiClient from "@/app/utils/apiClient";


export const getLostItemsList = async () => {
  const res = await apiClient.get("orders/getlostorders");
  return res.data.data;
};

export const addLostItem = async (Data: any) => {
  const response = await apiClient.post("orders/addlostorder", Data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const editLostItem = async (id: string, updatedData: any) => {
  const response = await apiClient.patch(`orders/update-lost-order/${id}`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteLostItem = async (id: string) => {
  const response = await apiClient.delete(`orders/delete-lost-order/${id}`);
  return response.data;
};

export const downloadLostOrdersReport = async (
  format: 'excel' | 'csv',
  fromDate: string,
  toDate: string
) => {
  const response = await apiClient.get(
    `reports/lost-orders-report?format=${format}&from_date=${fromDate}&to_date=${toDate}`,
    {
      responseType: 'blob',
    }
  );

  const fileExtension = format === 'excel' ? 'xlsx' : 'csv';
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `lost-orders-report.${fileExtension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
