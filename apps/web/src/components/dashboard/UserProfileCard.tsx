import { getInitials, formatMemberSince } from './utils';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  createdAt?: string;
}

interface UserProfileCardProps {
  user: User | null;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        {/* Avatar plus grand */}
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {user?.fullName ? getInitials(user.fullName) : getInitials(user?.email || 'U')}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {user?.fullName || 'Utilisateur'}
          </h3>
          {/* Badge rôle amélioré */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-slate-500 mb-1">Email</dt>
          <dd className="text-sm text-slate-900">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500 mb-1">Membre depuis</dt>
          <dd className="text-sm text-slate-900">
            {user?.createdAt ? formatMemberSince(user.createdAt) : 'N/A'}
          </dd>
        </div>
      </div>
    </div>
  );
}
