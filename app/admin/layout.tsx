import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotel Management Portal | New Taj Palace Hotel',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-gold-500 selection:text-neutral-900">
      {/* Dedicated isolated admin layout - ZERO public header, ZERO public footer */}
      {children}
    </div>
  );
}
