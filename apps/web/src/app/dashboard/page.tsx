'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return <DashboardLayout user={user} onLogout={logout} />;
}
