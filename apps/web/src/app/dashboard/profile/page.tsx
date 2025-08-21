'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button, Input, Card, ToastContainer, useToast, Skeleton } from '@/components/ui';
import type { UserProfileData, User } from '@/types/auth';

interface ProfileFormProps {
  user: User;
  onSave: (data: UserProfileData) => Promise<void>;
  loading: boolean;
}

function ProfileForm({ user, onSave, loading }: ProfileFormProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState<UserProfileData>({
    fullName: user.fullName || '',
    bio: '',
    phone: '',
    avatar: '',
    // Provider fields
    hourlyRate: undefined,
    zone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    companyName: '',
    siret: '',
  });

  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const isProvider = user.role === 'PROVIDER';

  // Calculer le pourcentage de complétion
  const calculateCompletion = () => {
    const requiredFields = ['fullName'];
    const providerFields = isProvider ? ['hourlyRate', 'zone'] : [];
    const allRequired = [...requiredFields, ...providerFields];
    
    const completed = allRequired.filter(field => {
      const value = formData[field as keyof UserProfileData];
      return value !== undefined && value !== '' && value !== null;
    });
    
    return Math.round((completed.length / allRequired.length) * 100);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      errors.fullName = 'Le nom complet est obligatoire';
    }

    if (formData.bio && formData.bio.length > 300) {
      errors.bio = 'La description ne peut pas dépasser 300 caractères';
    }

    if (formData.phone && !/^(?:\+33|0)[1-9](?:[0-9]{8})$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Format de téléphone invalide (format français requis)';
    }

    if (isProvider) {
      if (formData.hourlyRate !== undefined && formData.hourlyRate < 0) {
        errors.hourlyRate = 'Le tarif horaire ne peut pas être négatif';
      }

      if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
        errors.postalCode = 'Code postal invalide (5 chiffres requis)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Erreurs de validation', 'Veuillez corriger les erreurs avant de continuer');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      success('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès');
    } catch (err) {
      error('Erreur de sauvegarde', 'Une erreur est survenue lors de la sauvegarde');
      console.error('Erreur profil:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfileData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur du champ modifié
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const completion = calculateCompletion();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Indicateur de complétion */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Complétion du profil
          </h3>
          <span className="text-2xl font-bold text-blue-600">{completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completion === 100 
            ? '🎉 Votre profil est complet !' 
            : `Complétez votre profil pour attirer plus de clients`
          }
        </p>
      </Card>

      {/* Section Informations générales */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Informations générales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Votre nom complet"
              className={validationErrors.fullName ? 'border-red-500' : ''}
              disabled={saving}
            />
            {validationErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="06 12 34 56 78"
              className={validationErrors.phone ? 'border-red-500' : ''}
              disabled={saving}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Décrivez votre activité en quelques phrases..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              validationErrors.bio ? 'border-red-500' : 'border-gray-300'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            maxLength={300}
            disabled={saving}
          />
          <div className="flex justify-between items-center mt-1">
            {validationErrors.bio && (
              <p className="text-red-500 text-sm">{validationErrors.bio}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {(formData.bio || '').length}/300 caractères
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="px-6"
          >
            {saving ? 'Sauvegarde...' : 'Enregistrer les informations générales'}
          </Button>
        </div>
      </Card>

      {/* Section Provider (conditionnelle) */}
      {isProvider && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Informations professionnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tarif horaire (€) <span className="text-red-500">*</span>
              </label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="1"
                value={formData.hourlyRate || ''}
                onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
                placeholder="50"
                className={validationErrors.hourlyRate ? 'border-red-500' : ''}
                disabled={saving}
              />
              {validationErrors.hourlyRate && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.hourlyRate}</p>
              )}
            </div>

            <div>
              <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-2">
                Zone d'intervention <span className="text-red-500">*</span>
              </label>
              <Input
                id="zone"
                type="text"
                value={formData.zone || ''}
                onChange={(e) => handleChange('zone', e.target.value)}
                placeholder="Paris et région parisienne"
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise
              </label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Ma super entreprise"
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
                SIRET
              </label>
              <Input
                id="siret"
                type="text"
                value={formData.siret || ''}
                onChange={(e) => handleChange('siret', e.target.value)}
                placeholder="12345678901234"
                disabled={saving}
              />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Adresse</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse ligne 1
                </label>
                <Input
                  id="addressLine1"
                  type="text"
                  value={formData.addressLine1 || ''}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  placeholder="123 Rue de la Paix"
                  disabled={saving}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse ligne 2
                </label>
                <Input
                  id="addressLine2"
                  type="text"
                  value={formData.addressLine2 || ''}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  placeholder="Appartement, suite, etc."
                  disabled={saving}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Paris"
                  disabled={saving}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal
                </label>
                <Input
                  id="postalCode"
                  type="text"
                  value={formData.postalCode || ''}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="75001"
                  className={validationErrors.postalCode ? 'border-red-500' : ''}
                  disabled={saving}
                />
                {validationErrors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="px-6"
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer les informations professionnelles'}
            </Button>
          </div>
        </Card>
      )}
    </form>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toasts, removeToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement initial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveProfile = async (data: UserProfileData) => {
    // TODO: Appeler l'API pour sauvegarder le profil
    console.log('Sauvegarde profil:', data);
    
    // Simuler l'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // En production, ici on appellerait l'API:
    // await profileService.updateProfile(user.id, data);
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>

          {/* Navigation breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
                  Dashboard
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium">Profil</li>
            </ol>
          </nav>

          {/* Contenu principal */}
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-96 w-full rounded-lg" />
              {user.role === 'PROVIDER' && (
                <Skeleton className="h-96 w-full rounded-lg" />
              )}
            </div>
          ) : (
            <ProfileForm 
              user={user} 
              onSave={handleSaveProfile}
              loading={loading}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
