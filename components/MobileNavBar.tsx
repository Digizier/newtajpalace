"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BedDouble, CalendarCheck, Phone, MessageSquare } from 'lucide-react';

export default function MobileNavBar() {
  const pathname = usePathname();

  // Hide mobile nav bar inside admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Rooms', href: '/rooms', icon: BedDouble },
    { label: 'Book Now', href: '/book', icon: CalendarCheck, isPrimary: true },
    { label: 'WhatsApp', href: 'https://wa.me/923224845461', icon: MessageSquare, isExternal: true },
    { label: 'Call', href: 'tel:+923224845461', icon: Phone, isExternal: true },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      data-mobile-navbar="true"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/80 shadow-[0_-5px_20px_rgba(0,0,0,0.06)] px-3 py-2 no-print"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30 text-white transform active:scale-95 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gold-700 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center justify-center py-1 px-2 text-neutral-500 hover:text-gold-600 active:scale-95 transition-colors"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-colors active:scale-95 ${
                isActive ? 'text-gold-600 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
