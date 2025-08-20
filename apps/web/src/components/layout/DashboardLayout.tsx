'use client';

import ProtectedRoute from '../shared/ProtectedRoute';
import Header from './Header';
import WelcomeSection from '../features/dashboard/WelcomeSection';
import UserProfileCard from '../features/dashboard/UserProfileCard';
import FeaturesSection from '../features/dashboard/FeaturesSection';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  createdAt?: string;
}

interface DashboardLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header user={user} onLogout={onLogout} />

        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <WelcomeSection user={user} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Informations du compte - Version mobile-first */}
            <div className="lg:col-span-1">
              <UserProfileCard user={user} />
            </div>

            {/* Fonctionnalités disponibles */}
            <FeaturesSection user={user} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
