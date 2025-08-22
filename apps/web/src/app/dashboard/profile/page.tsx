'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Header from '@/components/layout/Header';
import { Card, ToastContainer, useToast, Skeleton } from '@/components/ui';
import ProfileStats from '@/components/features/profile/ProfileStats';
import ProfileForm from '@/components/features/profile/ProfileForm';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const {
    profileData,
    loading,
    error: profileError,
    completionPercentage,
    saveProfile,
  } = useProfile(user);

  const isAdmin = user?.role === 'ADMIN';

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={logout} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>

          {profileError && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{profileError}</p>
            </div>
          )}

          <ProfileStats user={user} completionPercentage={completionPercentage} />

          <Card className="p-6">
            {isAdmin ? (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                      Compte Administrateur
                    </h3>
                    <p className="text-blue-700 mb-4">bienvenue jeune Administrateur :)</p>
                    <div className="space-y-2 text-sm text-blue-600">
                      <p>
                        <strong>Email :</strong> {user.email}
                      </p>
                      <p>
                        <strong>Nom :</strong> {user.fullName || 'Non défini'}
                      </p>
                      <p>
                        <strong>Rôle :</strong> Administrateur
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-24 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ) : profileData ? (
              <ProfileForm
                user={{ ...user, ...profileData }}
                onSave={saveProfile}
                loading={loading}
                onSuccess={success}
                onError={error}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Impossible de charger les données du profil.</p>
              </div>
            )}
          </Card>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ProtectedRoute>
  );
}
