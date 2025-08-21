'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types/auth';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/components/layout/AuthLayout';

import * as Sentry from '@sentry/nextjs'; // ← ajout

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Bouton test Sentry
  const throwTestError = () => {
    // capture manuelle
    Sentry.captureException(new Error('Test Sentry depuis LoginPage'));
    // et throw classique (crash visible)
    throw new Error('Test Sentry — bouton sur LoginPage');
  };

  return (
    <AuthLayout
      title="Bon retour !"
      subtitle="Connectez-vous pour accéder à votre espace Conexa"
      alternativeLink={{
        text: 'Pas encore de compte ?',
        href: '/register',
        linkText: 'Créer un compte',
      }}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
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
          error={error}
        />

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Se connecter
        </Button>
      </form>

      {/* Bouton test Sentry - gardé intact */}
      <button
        onClick={throwTestError}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center z-50"
        title="Tester Sentry"
      >
        ⚡
      </button>
    </AuthLayout>
  );
}
