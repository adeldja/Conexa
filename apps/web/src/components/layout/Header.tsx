'use client';

import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import HeaderLogo from './HeaderLogo';
import HeaderBreadcrumb from './HeaderBreadcrumb';
import UserMenu from './UserMenu';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  createdAt?: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const breadcrumb = useBreadcrumb();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et navigation */}
          <div className="flex items-center space-x-4">
            <HeaderLogo user={user} />
            <HeaderBreadcrumb breadcrumb={breadcrumb} />
          </div>

          {/* Menu utilisateur */}
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
