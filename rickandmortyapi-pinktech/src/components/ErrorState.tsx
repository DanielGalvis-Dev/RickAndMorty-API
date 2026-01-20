// Componente de error

import { AlertCircle } from "lucide-react";

export const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle size={64} className="text-red-500 mb-4" />
    <p className="text-xl text-gray-700 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Reintentar
    </button>
  </div>
);
