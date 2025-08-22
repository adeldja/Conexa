import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();

  // Mapping des routes vers leurs labels
  const routeLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/profile': 'Profil',
    '/dashboard/slots': 'Mes créneaux',
    '/dashboard/bookings': 'Réservations',
    '/dashboard/reviews': 'Avis reçus',
    '/dashboard/specialties': 'Spécialités',
    '/dashboard/admin/seeder': 'Administration',
    '/providers': 'Prestataires',
    '/login': 'Connexion',
    '/register': 'Inscription',
  };

  // Construire le breadcrumb
  const breadcrumb: BreadcrumbItem[] = [];

  // Toujours commencer par Dashboard si on est dans une sous-page
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
    breadcrumb.push({ label: 'Dashboard', href: '/dashboard' });
  }

  // Ajouter la page actuelle
  const currentLabel = routeLabels[pathname];
  if (currentLabel) {
    breadcrumb.push({ label: currentLabel });
  } else {
    // Fallback pour les routes dynamiques
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    breadcrumb.push({ 
      label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) 
    });
  }

  return breadcrumb;
}
