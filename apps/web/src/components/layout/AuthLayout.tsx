'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  alternativeLink: {
    text: string;
    href: string;
    linkText: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  alternativeLink,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBFF] via-blue-50 to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1D4FFF] to-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1D4FFF] to-blue-600 bg-clip-text text-transparent">
                Conexa
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>

          {subtitle && <p className="text-slate-600 text-sm mb-6">{subtitle}</p>}

          {/* Alternative Link */}
          <p className="text-sm text-slate-600">
            {alternativeLink.text}{' '}
            <Link
              href={alternativeLink.href}
              className="font-medium text-[#1D4FFF] hover:text-blue-700 transition-colors duration-200"
            >
              {alternativeLink.linkText}
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="text-[#1D4FFF] hover:underline">
              conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="text-[#1D4FFF] hover:underline">
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
