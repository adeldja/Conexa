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

export default function FeaturesSection({ user }: FeaturesSectionProps) {
  return (
    <div className="lg:col-span-2">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Fonctionnalités disponibles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
