import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-neutral-100 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-600 flex items-center justify-center mx-auto text-2xl font-serif font-black">
          404
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
            The page or reservation record you are searching for does not exist or may have been updated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-charcoal hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/rooms"
            className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm"
          >
            <span>View Suites</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
