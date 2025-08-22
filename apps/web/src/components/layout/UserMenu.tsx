import { useState } from 'react';
import { ChevronDownIcon, CogIcon, LogoutIcon } from '../features/dashboard';
import { getInitials } from '../features/dashboard/utils';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
}

interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.fullName ? getInitials(user.fullName) : getInitials(user?.email || 'U')}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-slate-700">{user?.fullName || user?.email}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              // Navigation vers les paramètres
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <CogIcon className="w-4 h-4 mr-3" />
            Paramètres
          </button>
          <hr className="my-1 border-slate-200" />
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              onLogout();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogoutIcon className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
