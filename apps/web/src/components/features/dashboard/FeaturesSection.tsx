import FeatureCard from './FeatureCard';
import { CalendarIcon, UsersIcon, ChartBarIcon } from './Icons';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  createdAt?: string;
}

interface FeaturesSectionProps {
  user: User | null;
}

// Icônes additionnelles
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

export default function FeaturesSection({ user }: FeaturesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Fonctionnalités disponibles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Gestion du profil - Tous les utilisateurs */}
        <FeatureCard
          icon={<UserIcon className="w-6 h-6 text-purple-600" />}
          title="Gestion du profil"
          description="Modifiez vos informations personnelles et professionnelles."
          status="active"
          href="/dashboard/profile"
          buttonText="Gérer mon profil"
          iconBgColor="bg-purple-100"
          buttonBgColor="bg-purple-600"
          buttonHoverColor="hover:bg-purple-700"
        />

        {/* Fonctionnalités pour PROVIDER */}
        {user?.role === 'PROVIDER' && (
          <>
            {/* Gestion des créneaux - Active */}
            <FeatureCard
              icon={<CalendarIcon className="w-6 h-6 text-blue-600" />}
              title="Gestion des créneaux"
              description="Créez et gérez vos créneaux horaires pour permettre aux clients de prendre rendez-vous."
              status="active"
              href="/dashboard/slots"
              buttonText="Gérer mes créneaux"
              iconBgColor="bg-blue-100"
              buttonBgColor="bg-blue-600"
              buttonHoverColor="hover:bg-blue-700"
            />

            {/* Spécialités - Active */}
            <FeatureCard
              icon={<CogIcon className="w-6 h-6 text-orange-600" />}
              title="Spécialités"
              description="Gérez vos compétences et domaines d'expertise pour attirer les bons clients."
              status="active"
              href="/dashboard/specialties"
              buttonText="Mes spécialités"
              iconBgColor="bg-orange-100"
              buttonBgColor="bg-orange-600"
              buttonHoverColor="hover:bg-orange-700"
            />

            {/* Avis reçus - Active */}
            <FeatureCard
              icon={<MessageIcon className="w-6 h-6 text-yellow-600" />}
              title="Avis reçus"
              description="Consultez les évaluations et commentaires laissés par vos clients."
              status="active"
              href="/dashboard/reviews"
              buttonText="Voir mes avis"
              iconBgColor="bg-yellow-100"
              buttonBgColor="bg-yellow-600"
              buttonHoverColor="hover:bg-yellow-700"
            />

            {/* Gestion des clients - Bientôt disponible */}
            <FeatureCard
              icon={<UsersIcon className="w-6 h-6 text-slate-400" />}
              title="Gestion des clients"
              description="Consultez et gérez vos clients, leur historique et leurs préférences."
              status="coming-soon"
              buttonText="Bientôt disponible"
            />

            {/* Statistiques - Bientôt disponible */}
            <FeatureCard
              icon={<ChartBarIcon className="w-6 h-6 text-slate-400" />}
              title="Statistiques"
              description="Analysez vos performances et suivez l'évolution de votre activité."
              status="coming-soon"
              buttonText="Bientôt disponible"
            />
          </>
        )}

        {/* Fonctionnalités pour CLIENT */}
        {user?.role === 'CLIENT' && (
          <FeatureCard
            icon={<CalendarIcon className="w-6 h-6 text-green-600" />}
            title="Prise de rendez-vous"
            description="Consultez les disponibilités et prenez rendez-vous avec un prestataire."
            status="active"
            href="/dashboard/bookings"
            buttonText="Prendre rendez-vous"
            iconBgColor="bg-green-100"
            buttonBgColor="bg-green-600"
            buttonHoverColor="hover:bg-green-700"
          />
        )}

        {/* Fonctionnalités pour ADMIN */}
        {user?.role === 'ADMIN' && (
          <FeatureCard
            icon={<DatabaseIcon className="w-6 h-6 text-red-600" />}
            title="Création BDD"
            description="Outils d'administration pour initialiser et gérer les données de la base."
            status="active"
            href="/dashboard/admin/seeder"
            buttonText="Administrer"
            iconBgColor="bg-red-100"
            buttonBgColor="bg-red-600"
            buttonHoverColor="hover:bg-red-700"
          />
        )}
      </div>
    </div>
  );
}
