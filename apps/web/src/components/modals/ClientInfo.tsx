interface ClientInfoProps {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}

export default function ClientInfo({ clientName, clientEmail, clientPhone, notes }: ClientInfoProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-3">Informations du client</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Nom complet
          </label>
          <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
            {clientName}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Email
          </label>
          <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
            <a 
              href={`mailto:${clientEmail}`}
              className="hover:underline"
            >
              {clientEmail}
            </a>
          </div>
        </div>

        {clientPhone && (
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Téléphone
            </label>
            <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
              <a 
                href={`tel:${clientPhone}`}
                className="hover:underline"
              >
                {clientPhone}
              </a>
            </div>
          </div>
        )}

        {notes && (
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Notes
            </label>
            <div className="text-sm text-blue-700 bg-white px-3 py-2 rounded border">
              {notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
