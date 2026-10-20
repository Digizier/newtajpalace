import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Sparkles, HeartHandshake, Phone, MessageSquare, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | New Taj Palace Hotel Bund Road Lahore',
  description: 'Learn about New Taj Palace Hotel Lahore. Comfortable, budget-friendly family and business accommodation on Main Bund Road, opposite City Bus Terminal and near Rahber Travels.',
  alternates: {
    canonical: 'https://newtajpalace.com/about',
  },
  openGraph: {
    title: 'About New Taj Palace Hotel | Bund Road Lahore',
    description: 'Discover New Taj Palace Hotel, Lahore. Premium comfort, clean rooms, free Wi-Fi, and 24/7 hospitality opposite City Bus Terminal.',
    url: 'https://newtajpalace.com/about',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'About New Taj Palace Hotel Lahore' }],
  },
};

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
          Our Hospitality Story
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Welcome to New Taj Palace Hotel, Lahore
        </h1>
        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          Offering comfortable and affordable accommodation in Lahore, Pakistan, making it a convenient choice for families, business travelers, and visitors to the historic city.
        </p>
      </div>

      {/* Main Narrative with Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5 text-neutral-600 leading-relaxed text-sm sm:text-base">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            A Practical & Welcoming Haven in the Heart of Lahore
          </h2>
          <p>
            Located strategically on Bund Road near Rahber Travels and opposite the City Bus Terminal in Dholanwal, New Taj Palace Hotel provides effortless access to local transport, major coach services, and Lahore’s celebrated cultural landmarks.
          </p>
          <p>
            Our core mission is simple: to offer genuine hospitality, clean and peaceful air-conditioned rooms, and attentive service without charging inflated luxury prices. Whether you are arriving for a quick business conference, traveling with your family, or stopping over during transit, our hotel delivers comfort you can rely on.
          </p>
          <p>
            Guests can enjoy comfortable rooms with private bathrooms, free Wi-Fi, on-site dining, room service, and convenient parking. With a welcoming atmosphere and essential facilities, New Taj Palace Hotel aims to provide a pleasant and relaxing stay for both short-term and extended visits.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
            >
              Book a Room Online
            </Link>
            <a
              href="https://wa.me/923224845461"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Contact Reception</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80">
            <img
              src="/images/rooms/room-2.webp"
              alt="Executive Suite"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80 mt-8">
            <img
              src="/images/rooms/room-9.webp"
              alt="Family Suite"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-8 rounded-3xl bg-white border border-neutral-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-900">Uncompromising Cleanliness</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Freshly laundered linens, sanitized private bathrooms, and daily housekeeping guarantee that your stay is spotless and hygienic.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-neutral-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-900">Transit Proximity</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Walking distance from the City Bus Terminal and Rahber Travels on Bund Road. Zero long commutes when catching early or late coaches.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-neutral-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-900">Genuine Hospitality</h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Round-the-clock front desk assistance, friendly staff, and transparent rates with Pay at Hotel flexibility.
          </p>
        </div>
      </div>
    </div>
  );
}
