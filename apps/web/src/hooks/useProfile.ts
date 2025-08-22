import { useState, useEffect } from 'react';
import { clientProfileService, providerProfileService } from '@/services/profileService';
import type { UserProfileData, User } from '@/types/auth';

export function useProfile(user: User | null) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isProvider = user?.role === 'PROVIDER';
  const isAdmin = user?.role === 'ADMIN';

  // Calculer le pourcentage de complétion
  const calculateCompletion = (data: UserProfileData): number => {
    const requiredFields = ['fullName'];
    const providerFields = isProvider ? ['hourlyRate', 'zone'] : [];
    const allRequired = [...requiredFields, ...providerFields];

    const completed = allRequired.filter(field => {
      const value = data[field as keyof UserProfileData];
      return value !== undefined && value !== '' && value !== null;
    });

    return Math.round((completed.length / allRequired.length) * 100);
  };

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Pour les admins, initialiser avec les données utilisateur de base
      if (isAdmin) {
        const profileData: UserProfileData = {
          fullName: user.fullName || '',
          bio: '',
          phone: '',
          avatar: '',
          hourlyRate: undefined,
          zone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          postalCode: '',
          companyName: '',
          siret: '',
        };
        setProfileData(profileData);
        setLoading(false);
        return;
      }

      // Utiliser le bon service selon le rôle
      const service = isProvider ? providerProfileService : clientProfileService;
      const data = await service.get(user.id);

      // Convertir les données en format UserProfileData
      const profileData: UserProfileData = {
        fullName: user.fullName || '',
        bio: isProvider ? (data as any).description || '' : '',
        phone: data.phone || '',
        avatar: data.avatar || '',
        // Provider fields
        hourlyRate: isProvider ? (data as any).defaultPrice : undefined,
        zone: isProvider ? (data as any).address || '' : '',
        addressLine1: isProvider ? (data as any).address || '' : '',
        addressLine2: '',
        city: '',
        postalCode: '',
        companyName: isProvider ? (data as any).businessName || '' : '',
        siret: '',
      };

      setProfileData(profileData);
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Impossible de charger le profil');

      // Initialiser avec les données de base de l'utilisateur
      setProfileData({
        fullName: user.fullName || '',
        bio: '',
        phone: '',
        avatar: '',
        hourlyRate: undefined,
        zone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        companyName: '',
        siret: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: UserProfileData) => {
    if (!user?.id) throw new Error('Utilisateur non connecté');

    // Les admins ne peuvent pas modifier leur profil via cette interface
    if (isAdmin) {
      throw new Error(
        'Les profils administrateur ne peuvent pas être modifiés via cette interface'
      );
    }

    // Utiliser le bon service selon le rôle
    const service = isProvider ? providerProfileService : clientProfileService;

    if (isProvider) {
      // Convertir UserProfileData vers le format provider
      const providerData = {
        businessName: data.companyName || '',
        description: data.bio || '',
        phone: data.phone || '',
        website: '',
        address: data.addressLine1 || '',
        avatar: data.avatar || '',
        defaultPrice: data.hourlyRate || 0,
        currency: 'EUR',
      };
      await service.update(user.id, providerData);
    } else {
      // Convertir UserProfileData vers le format client
      const clientData = {
        phone: data.phone || '',
        avatar: data.avatar || '',
      };
      await service.update(user.id, clientData);
    }

    setProfileData(data);
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const completionPercentage = profileData ? calculateCompletion(profileData) : 0;

  return {
    profileData,
    loading,
    error,
    completionPercentage,
    saveProfile,
    loadProfile,
  };
}
