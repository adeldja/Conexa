interface User {
  role: string;
}

interface HeaderLogoProps {
  user: User | null;
}

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Panneau Administrateur';
    case 'PROVIDER':
      return 'Tableau de bord Prestataire';
    case 'USER':
      return 'Espace Client';
    default:
      return 'Dashboard';
  }
};

export default function HeaderLogo({ user }: HeaderLogoProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 flex items-center justify-center">
        <img src="/logo-c.svg" alt="Conexa Logo" className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Conexa</h1>
        <p className="text-xs text-slate-500">{getRoleLabel(user?.role)}</p>
      </div>
    </div>
  );
}
