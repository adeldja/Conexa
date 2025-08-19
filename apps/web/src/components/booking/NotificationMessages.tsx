interface NotificationMessagesProps {
  error: string | null;
  success: string | null;
}

export default function NotificationMessages({ error, success }: NotificationMessagesProps) {
  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
    </>
  );
}
