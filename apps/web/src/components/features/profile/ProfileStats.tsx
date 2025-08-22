import type { User } from '@/types/auth';

interface ProfileStatsProps {
  user: User;
  completionPercentage: number;
}

export default function ProfileStats({ user, completionPercentage }: ProfileStatsProps) {
  const isProvider = user.role === 'PROVIDER';
  const isAdmin = user.role === 'ADMIN';

  // Pour les admins, ne pas afficher les stats
  if (isAdmin) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Profil complété</p>
            <p className="text-2xl font-bold text-blue-600">{completionPercentage}%</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rôle</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.role === 'PROVIDER'
                ? 'Prestataire'
                : user.role === 'CLIENT'
                  ? 'Client'
                  : user.role === 'ADMIN'
                    ? 'Administrateur'
                    : user.role}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
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
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Membre depuis</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
