'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, CogIcon, LogoutIcon } from '../features/dashboard';
import { getInitials } from '../features/dashboard/utils';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const breadcrumb = useBreadcrumb();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo-c.svg" alt="Conexa Logo" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Conexa</h1>
                <p className="text-xs text-slate-500">Dashboard Provider</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/conexa-logo-small.svg" alt="Conexa Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Conexa</h1>
                <p className="text-xs text-slate-500">Dashboard Provider</p>
              </div>
            </div>

            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-slate-400">|</span>
                {breadcrumb.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <span className="text-slate-400 mx-2">/</span>}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-slate-900 font-medium">{item.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Menu utilisateur */}
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
                <p className="text-sm font-medium text-slate-700">
                  {user?.fullName || user?.email}
                </p>
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
                    // Ici vous pourriez ajouter une navigation vers les paramètres
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
        </div>
      </div>
    </header>
  );
}
