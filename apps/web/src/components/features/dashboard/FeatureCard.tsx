import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  status: 'active' | 'coming-soon';
  href?: string;
  buttonText: string;
  iconBgColor?: string;
  buttonBgColor?: string;
  buttonHoverColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  status,
  href,
  buttonText,
  iconBgColor = 'bg-blue-100',
  buttonBgColor = 'bg-blue-600',
  buttonHoverColor = 'hover:bg-blue-700'
}: FeatureCardProps) {
  const isActive = status === 'active';
  const cardClasses = `bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${
    isActive ? 'hover:shadow-md transition-shadow' : 'opacity-75'
  }`;

  const statusBadge = isActive ? (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Actif
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
      Bientôt
    </span>
  );

  const iconWrapper = (
    <div className={`w-12 h-12 ${isActive ? iconBgColor : 'bg-slate-100'} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
  );

  const button = isActive && href ? (
    <Link href={href}>
      <span className={`inline-flex items-center justify-center w-full px-4 py-2 ${buttonBgColor} ${buttonHoverColor} text-white text-sm font-medium rounded-lg transition-colors`}>
        {buttonText}
      </span>
    </Link>
  ) : (
    <button 
      disabled 
      className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-300 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
    >
      {buttonText}
    </button>
  );

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-4">
        {iconWrapper}
        {statusBadge}
      </div>
      <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      {button}
    </div>
  );
}
