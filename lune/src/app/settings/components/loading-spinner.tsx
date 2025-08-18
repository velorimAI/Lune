export const LoadingSpinner = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-gray-900 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 text-sm">در حال بارگذاری...</p>
      </div>
    </div>
  );
};