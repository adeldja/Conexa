'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterRequest } from '@/types/auth';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    fullName: '',
    role: 'CLIENT',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await registerUser(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'CLIENT', label: 'Client - Je recherche des prestations' },
    { value: 'PROVIDER', label: 'Prestataire - Je propose mes services' },
    { value: 'ADMIN', label: 'Administrateur' },
  ];

  return (
    <AuthLayout
      title="Rejoignez Conexa"
      subtitle="Créez votre compte en quelques secondes"
      alternativeLink={{
        text: 'Déjà un compte ?',
        href: '/login',
        linkText: 'Se connecter',
      }}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          type="text"
          name="fullName"
          required
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        <Input
          label="Adresse email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="votre@email.com"
          value={formData.email}
          onChange={handleChange}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          }
        />

        <Input
          label="Mot de passe"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          placeholder="Minimum 6 caractères"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <Select
          label="Type de compte"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
        />

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Créer mon compte
        </Button>
      </form>
    </AuthLayout>
  );
}
