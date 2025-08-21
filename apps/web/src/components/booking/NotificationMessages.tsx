interface NotificationMessagesProps {
  error: string | null;
  success: string | null;
}

export default function NotificationMessages({ error, success }: NotificationMessagesProps) {
  return (
    <div className="space-y-4 mb-8">
      {error && (
        <div className="flex items-start space-x-4 p-6 bg-red-50 border-2 border-red-100 text-red-800 rounded-2xl shadow-lg">
          <div className="flex-shrink-0">
            <div className="p-2 bg-red-100 rounded-xl">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-900 mb-1">Erreur</h3>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-4 p-6 bg-green-50 border-2 border-green-100 text-green-800 rounded-2xl shadow-lg">
          <div className="flex-shrink-0">
            <div className="p-2 bg-green-100 rounded-xl">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-1">Succès</h3>
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
}
