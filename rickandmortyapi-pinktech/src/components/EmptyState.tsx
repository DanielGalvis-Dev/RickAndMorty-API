// Componente de estado vacío

import { AlertCircle } from "lucide-react";

export const EmptyState: React.FC<{
  message: string;
  action?: () => void;
  actionLabel?: string;
}> = ({ message, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle size={64} className="text-gray-400 mb-4" />
    <p className="text-xl text-gray-600 mb-4">{message}</p>
    {action && (
      <button
        onClick={action}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
