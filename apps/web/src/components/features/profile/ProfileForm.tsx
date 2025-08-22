import { useState, useEffect } from 'react';
import { Button, FormInput } from '@/components/ui';
import type { UserProfileData, User } from '@/types/auth';

interface ProfileFormProps {
  user: User;
  onSave: (data: UserProfileData) => Promise<void>;
  loading: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export default function ProfileForm({
  user,
  onSave,
  loading,
  onSuccess,
  onError,
}: ProfileFormProps) {
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

  const handleInputChange = (field: keyof UserProfileData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      errors.fullName = 'Le nom complet est requis';
    }

    if (isProvider) {
      if (!formData.hourlyRate || formData.hourlyRate <= 0) {
        errors.hourlyRate = 'Le tarif horaire doit être supérieur à 0';
      }
      if (!formData.zone?.trim()) {
        errors.zone = "La zone d'intervention est requise";
      }
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Format de téléphone invalide';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      onError?.('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      onSuccess?.('Profil mis à jour avec succès');
    } catch (err) {
      onError?.('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nom complet *"
            value={formData.fullName}
            onChange={e => handleInputChange('fullName', e.target.value)}
            error={validationErrors.fullName}
          />
          <FormInput
            label="Téléphone"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            error={validationErrors.phone}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
          <textarea
            value={formData.bio}
            onChange={e => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Parlez-nous de vous..."
          />
        </div>
      </div>

      {/* Informations provider */}
      {isProvider && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations prestataire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Tarif horaire (€) *"
              type="number"
              value={formData.hourlyRate?.toString() || ''}
              onChange={e => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
              error={validationErrors.hourlyRate}
            />
            <FormInput
              label="Zone d'intervention *"
              value={formData.zone}
              onChange={e => handleInputChange('zone', e.target.value)}
              error={validationErrors.zone}
            />
            <FormInput
              label="Nom de l'entreprise"
              value={formData.companyName}
              onChange={e => handleInputChange('companyName', e.target.value)}
            />
            <FormInput
              label="SIRET"
              value={formData.siret}
              onChange={e => handleInputChange('siret', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Adresse</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Adresse ligne 1"
                value={formData.addressLine1}
                onChange={e => handleInputChange('addressLine1', e.target.value)}
              />
              <FormInput
                label="Adresse ligne 2"
                value={formData.addressLine2}
                onChange={e => handleInputChange('addressLine2', e.target.value)}
              />
              <FormInput
                label="Ville"
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
              />
              <FormInput
                label="Code postal"
                value={formData.postalCode}
                onChange={e => handleInputChange('postalCode', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button onClick={handleSave} disabled={saving || loading} variant="primary">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
}
