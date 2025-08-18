interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = "خطا در دریافت اطلاعات" }: ErrorStateProps) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-800 font-medium">{message}</p>
      </div>
    </div>
  );
};