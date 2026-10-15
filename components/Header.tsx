"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Menu, X, ChevronRight } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render public header on admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Rooms & Suites', href: '/rooms' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About Us', href: '/about' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-charcoal/95 backdrop-blur-md shadow-lg py-2.5 border-b border-charcoal-border'
            : 'bg-gradient-to-b from-charcoal/90 via-charcoal/60 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="New Taj Palace Hotel Logo"
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-gold-300 transition-colors">
                NEW TAJ PALACE
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-medium">
                Hotel • Lahore
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-gold-300 font-semibold bg-white/10'
                      : 'text-neutral-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="tel:+923224845461"
              className="flex items-center space-x-2 text-neutral-300 hover:text-gold-300 text-xs font-semibold tracking-wide transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>0322 4845461</span>
            </a>

            <Link
              href="/book"
              prefetch={false}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal-deep font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:shadow-gold-500/25 active:scale-95 transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Room</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href="/book"
              prefetch={false}
              className="sm:hidden bg-gold-500 text-charcoal font-bold px-3 py-1.5 rounded-full text-xs"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-gold-300 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-charcoal-deep text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slideLeft">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-border">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <div>
                    <h4 className="font-serif font-bold text-white leading-tight">NEW TAJ PALACE</h4>
                    <p className="text-[10px] text-gold-400 tracking-wider uppercase">Hotel Lahore</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gold-500/20 text-gold-300 font-bold border-l-4 border-gold-400'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-charcoal-border space-y-3">
              <Link
                href="/book"
                prefetch={false}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal font-bold py-3 rounded-xl text-center text-sm shadow-lg shadow-gold-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Room Now</span>
              </Link>
              <a
                href="tel:+923224845461"
                className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-medium py-3 rounded-xl text-center text-sm"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call +92 322 4845461</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
