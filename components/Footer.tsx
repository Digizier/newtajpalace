"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, MessageSquare, Facebook, Instagram, ShieldCheck, Clock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="no-print bg-charcoal-deep text-neutral-300 pt-16 pb-24 md:pb-12 border-t border-charcoal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-charcoal-border">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="New Taj Palace Hotel"
                className="w-14 h-14 object-contain filter drop-shadow-md"
              />
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block">
                  NEW TAJ PALACE
                </span>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-medium">
                  Hotel • Lahore
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              New Taj Palace Hotel offers comfortable and affordable accommodation in Lahore, Pakistan. Conveniently located on Bund Road near Rahber Travels and opposite the City Bus Terminal.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/share/1HisKFMDMg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-500 hover:text-charcoal flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/newtajpalacehotel?obrf=Nm14eDlrdXhwb2V2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-500 hover:text-charcoal flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Instagram Page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923224845461"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="WhatsApp Contact"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-gold-300 transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold-300 transition-colors">
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link href="/book" prefetch={false} className="hover:text-gold-300 transition-colors">
                  Online Room Reservation
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-300 transition-colors">
                  Hotel Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About the Hotel
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies & Security */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Policies & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cancellation-policy" className="hover:text-gold-300 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Get Directions & Contact
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-charcoal-border">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gold-400 mb-1">
                <Clock className="w-4 h-4" />
                <span>Front Desk Operations</span>
              </div>
              <p className="text-xs text-neutral-400">
                24/7 Reception & Room Assistance available for all guests.
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3.5">
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Hotel Contact Details
            </h4>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <p className="text-neutral-300 leading-snug">
                Near Rahber Travel, Opp City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan
              </p>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="tel:+923224845461" className="hover:text-gold-300 transition-colors">
                +92 322 4845461
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href="https://wa.me/923224845461" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">
                WhatsApp: 0322 4845461
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="mailto:yasinjimi4u84@gmail.com" className="hover:text-gold-300 transition-colors break-all">
                yasinjimi4u84@gmail.com
              </a>
            </div>

            <div className="pt-2">
              <a
                href="https://share.google/piBoQEYODJrE0SZoK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-bold text-charcoal bg-gold-400 hover:bg-gold-300 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 space-y-3 sm:space-y-0">
          <p>© {currentYear} New Taj Palace Hotel, Lahore. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Comfortable, Clean & Affordable Hospitality in Lahore</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
