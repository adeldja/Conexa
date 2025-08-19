interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  createdAt?: string;
}

interface WelcomeSectionProps {
  user: User | null;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Bienvenue, {user?.fullName || user?.email?.split('@')[0]} 👋
      </h2>
      <p className="text-slate-600">
        Gérez vos créneaux et suivez votre activité depuis votre tableau de bord.
      </p>
    </div>
  );
}
