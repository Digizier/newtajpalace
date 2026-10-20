import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Users, 
  BedDouble, 
  Maximize2, 
  Check, 
  Calendar, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { getRoomCategoryBySlug, getAllAdminRoomCategories } from '@/lib/db';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

interface RoomPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Required for Next.js output: 'export'
  return [
    { slug: 'executive-suite' },
    { slug: 'deluxe-king-room' },
    { slug: 'family-quad-suite' },
    { slug: 'standard-double-room' },
    { slug: 'junior-executive-suite' },
    { slug: 'triple-bed-room' },
    { slug: 'business-solo-room' },
    { slug: 'master-presidential-suite' }
  ];
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomCategoryBySlug(slug);
  if (!room) {
    return { title: 'Room Not Found | New Taj Palace Hotel Lahore' };
  }
  const pageUrl = `https://newtajpalace.com/rooms/${slug}`;
  const imageUrl = room.featured_image || '/images/rooms/room-2.webp';
  return {
    title: `${room.name} | New Taj Palace Hotel Lahore`,
    description: `${room.short_desc} Book ${room.name} at New Taj Palace Hotel on Bund Road, Lahore. Features AC, free Wi-Fi, private bath, and 24/7 room service from PKR ${room.base_price.toLocaleString()}/night.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${room.name} | New Taj Palace Hotel Lahore`,
      description: room.short_desc,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 800, alt: `${room.name} New Taj Palace Hotel Lahore` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${room.name} | New Taj Palace Hotel Lahore`,
      description: room.short_desc,
      images: [imageUrl],
    },
  };
}

export default async function RoomDetailPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const room = await getRoomCategoryBySlug(slug);

  if (!room) {
    notFound();
  }

  const roomSchema = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description || room.short_desc,
    bed: room.bed_type,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: (room.max_adults || 2) + (room.max_children || 0),
      unitText: 'guests'
    },
    offers: {
      '@type': 'Offer',
      price: room.base_price,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      url: `https://newtajpalace.com/rooms/${slug}`
    },
    amenityFeature: (room.amenities || []).map((a: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://newtajpalace.com/' },
      { '@type': 'ListItem', position: 2, name: 'Rooms & Suites', item: 'https://newtajpalace.com/rooms/' },
      { '@type': 'ListItem', position: 3, name: room.name, item: `https://newtajpalace.com/rooms/${slug}/` }
    ]
  };

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <JsonLd data={[roomSchema, breadcrumbSchema]} />
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-neutral-500">
        <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/rooms" className="hover:text-gold-600 transition-colors">Rooms & Suites</Link>
        <span>/</span>
        <span className="text-neutral-900 font-bold">{room.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Images & Overview */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Showcase Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/10] border border-neutral-100 bg-charcoal">
            <img
              src={room.featured_image || '/images/rooms/room-2.webp'}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-charcoal/90 backdrop-blur-md px-4 py-2 rounded-2xl text-gold-300 font-serif font-bold text-lg shadow-lg">
              Rs. {room.base_price.toLocaleString()} <span className="text-xs text-neutral-300 font-sans font-normal">/ night</span>
            </div>
          </div>

          {/* Title & Specs */}
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              {room.name}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mt-4">
              {room.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center space-x-3">
                <Users className="w-5 h-5 text-gold-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Occupancy</span>
                  <span className="text-sm font-bold text-neutral-900">Up to {room.max_adults} Adults</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center space-x-3">
                <BedDouble className="w-5 h-5 text-gold-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Bedding</span>
                  <span className="text-sm font-bold text-neutral-900">{room.bed_type}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center space-x-3 col-span-2 sm:col-span-1">
                <Maximize2 className="w-5 h-5 text-gold-600 flex-shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Room Dimensions</span>
                  <span className="text-sm font-bold text-neutral-900">{room.room_size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Amenities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
              Suite Amenities & Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3 text-sm text-neutral-700">
                  <div className="w-6 h-6 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies & Rules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Check-in & Hotel Policies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-600">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-800">Check-In / Check-Out</h4>
                  <p className="text-xs mt-1">Check-in from 02:00 PM. Check-out until 12:00 PM.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-800">Identity Verification</h4>
                  <p className="text-xs mt-1">Valid CNIC or Passport required for each adult at arrival.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xl space-y-6">
            <div className="pb-4 border-b border-neutral-100">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block">
                Direct Reservation
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="font-serif text-3xl font-bold text-neutral-900">
                  Rs. {room.base_price.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500">/ night</span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                ✓ Best Rate Guarantee & Free Cancellation
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href={`/book?room=${room.slug}`}
                prefetch={false}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal font-bold py-3.5 px-6 rounded-2xl text-center text-sm sm:text-base shadow-lg shadow-gold-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve This Suite</span>
              </Link>

              <a
                href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel, I would like to inquire about reserving the ${room.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-3 px-4 rounded-2xl text-center text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href="tel:+923224845461"
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-3 px-4 rounded-2xl text-center text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-600" />
                <span>Call Front Desk (0322 4845461)</span>
              </a>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-500">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>No advance payment needed (Pay at Hotel)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Opposite City Bus Terminal, Bund Road</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Free high-speed Wi-Fi included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
