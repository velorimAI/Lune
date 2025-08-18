export default function Loading() {
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