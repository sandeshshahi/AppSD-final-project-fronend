export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-50 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
  </div>
);
