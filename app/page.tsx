"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wifi, 
  Tv, 
  UtensilsCrossed, 
  Car, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Phone, 
  MessageSquare,
  Users,
  CheckCircle2,
  CalendarCheck,
  Video,
  AlertCircle,
  Wrench,
  Eye
} from 'lucide-react';
import HeroBannerSection from '@/components/HeroBanner';
import { getRoomCategories, getFAQs, getGalleryItems } from '@/lib/db';
import type { RoomCategory, FAQ, GalleryItem } from '@/lib/types';
import { RoomCardSkeleton } from '@/components/Shimmer';
import RoomDetailsModal from '@/components/RoomDetailsModal';

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState<RoomCategory[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedModalRoom, setSelectedModalRoom] = useState<RoomCategory | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsRes, galleryRes, faqsRes] = await Promise.all([
          getRoomCategories(1, 4), // fetch 4 featured suites for home
          getGalleryItems(),
          getFAQs()
        ]);
        setFeaturedRooms(roomsRes.data || []);
        setGalleryPhotos((galleryRes || []).slice(0, 6));
        setFaqs((faqsRes || []).slice(0, 5));
      } catch (err) {
        console.error('Home page data error:', err);
      } finally {
        setLoadingRooms(false);
      }
    }
    loadData();
  }, []);

  const amenities = [
    { title: 'Free High-Speed Wi-Fi', desc: 'Stay connected throughout your stay in all rooms and public lounges.', icon: Wifi },
    { title: 'Air-Conditioned Comfort', desc: 'Silent inverter ACs and heating for ideal indoor temperatures year-round.', icon: Sparkles },
    { title: '24/7 Room Service', desc: 'Fresh hot meals, local tea/chai, and assistance delivered to your door.', icon: UtensilsCrossed },
    { title: 'Convenient Parking', desc: 'Secure on-site vehicle parking for guests and family vehicles.', icon: Car },
    { title: '24-Hour Front Desk', desc: 'Round-the-clock check-in assistance, luggage care, and guidance.', icon: Clock },
    { title: 'Opposite Bus Terminal', desc: 'Steps away from Rahber Travels and major city transit terminals.', icon: MapPin },
  ];

  return (
    <div className="flex flex-col space-y-20 pb-16">
      {/* 1. Hero Banner Carousel & Quick Booking Widget */}
      <HeroBannerSection />

      {/* 2. Welcome & Proximity Advantage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gold-100/80 text-gold-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-gold-300/40">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Welcome to New Taj Palace Hotel, Lahore</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              Comfortable, Clean & Affordable Accommodation in Lahore
            </h2>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
              New Taj Palace Hotel offers comfortable and affordable accommodation in Lahore, Pakistan, making it a convenient choice for families, business travelers, and visitors to the city. Located on Bund Road near Rahber Travels and the City Bus Terminal in Dholanwal, the hotel provides easy access to local transport and nearby attractions.
            </p>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
              Guests can enjoy comfortable rooms with private bathrooms, free Wi-Fi, on-site dining, room service, and convenient parking. With a welcoming atmosphere and essential facilities, New Taj Palace Hotel aims to provide a pleasant and relaxing stay for both short-term and extended visits.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                <span className="block font-serif text-2xl font-bold text-gold-600">24/7</span>
                <span className="text-xs text-neutral-500 font-medium">Front Desk & Security</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                <span className="block font-serif text-2xl font-bold text-gold-600">100%</span>
                <span className="text-xs text-neutral-500 font-medium">Clean Linen & Rooms</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm col-span-2 sm:col-span-1">
                <span className="block font-serif text-2xl font-bold text-gold-600">Bund Rd</span>
                <span className="text-xs text-neutral-500 font-medium">Prime Transport Hub</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
              <img
                src="/images/rooms/room-2.webp"
                alt="New Taj Palace Hotel Suite"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-bold mb-1">
                  Featured Executive Suite
                </span>
                <h4 className="font-serif text-xl font-bold">
                  Designed for Peaceful Relaxation
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Rooms Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
              Accommodation Options
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              Featured Room Suites
            </h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center space-x-2 text-gold-700 hover:text-gold-800 font-bold text-sm mt-3 md:mt-0 transition-colors"
          >
            <span>View All 8 Room Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingRooms ? (
            Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)
          ) : (
          featuredRooms.map((room) => {
            const status = room.status || 'available';
            const isAvailable = status === 'available';
            const isOccupied = status === 'occupied';
            const isMaintenance = status === 'maintenance';
            const galleryCount = (Array.isArray(room.gallery_images) ? room.gallery_images.length : 0);

            return (
              <div
                key={room.id}
                className="group bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Room Image */}
                <div 
                  onClick={() => setSelectedModalRoom(room)}
                  className="relative h-56 overflow-hidden cursor-pointer select-none"
                >
                  <img
                    src={room.featured_image || '/images/rooms/room-2.webp'}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-charcoal/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold-300 shadow-sm">
                    Rs. {room.base_price.toLocaleString()} / night
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1">
                    {isAvailable && (
                      <span className="bg-emerald-950/85 backdrop-blur-sm text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Available</span>
                      </span>
                    )}

                    {isOccupied && (
                      <span className="bg-amber-950/85 backdrop-blur-sm text-amber-300 border border-amber-500/40 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Occupied</span>
                      </span>
                    )}

                    {isMaintenance && (
                      <span className="bg-neutral-900/85 backdrop-blur-sm text-neutral-300 border border-neutral-600 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1">
                        <Wrench className="w-3 h-3 text-neutral-400" />
                        <span>Maintenance</span>
                      </span>
                    )}
                  </div>

                  {/* Media Indicators */}
                  <div className="absolute bottom-2.5 left-3 flex items-center space-x-1.5 text-[10px] font-bold text-white">
                    {galleryCount > 0 && (
                      <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        {galleryCount + 1} Photos
                      </span>
                    )}
                    {room.video_url && (
                      <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center space-x-1 text-red-400">
                        <Video className="w-3 h-3 text-red-400" />
                        <span>Video</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => setSelectedModalRoom(room)}
                      className="font-serif text-lg font-bold text-neutral-900 group-hover:text-gold-700 transition-colors cursor-pointer"
                    >
                      {room.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {room.short_desc}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-100">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-gold-600" />
                        <span>Up to {room.max_adults} Adults</span>
                      </div>
                      <span className="text-neutral-300">•</span>
                      <span>{room.bed_type}</span>
                    </div>
                  </div>

                  {/* Smart Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setSelectedModalRoom(room)}
                      className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-2.5 px-3 rounded-xl text-xs text-center flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Details</span>
                    </button>

                    {isAvailable ? (
                      <Link
                        href={`/book?room=${room.slug}`}
                        prefetch={false}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center flex items-center justify-center space-x-1 shadow-sm active:scale-95 transition-all"
                      >
                        <span>Book</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : isOccupied ? (
                      <a
                        href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I see that the "${room.name}" is currently OCCUPIED. When is it next available?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-2 rounded-xl text-[11px] text-center flex items-center justify-center shadow-sm active:scale-95 transition-all"
                      >
                        <span>Occupied</span>
                      </a>
                    ) : (
                      <a
                        href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I see that "${room.name}" is under MAINTENANCE. Please advise on available rooms.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-neutral-800 hover:bg-neutral-900 text-white font-bold py-2.5 px-2 rounded-xl text-[11px] text-center flex items-center justify-center shadow-sm active:scale-95 transition-all"
                      >
                        <span>Maintenance</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </section>

      {/* 4. Hotel Facilities & Amenities */}
      <section className="bg-charcoal-deep text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-2">
              Guest Facilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Amenities Designed for Your Peace of Mind
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              Essential amenities and sincere Punjabi hospitality to make your Lahore visit worry-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/50 transition-colors flex items-start space-x-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-400/20 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Strategic Location & Transport Advantage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prime Transit Location in Lahore</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Opposite City Bus Terminal & Near Rahber Travels
            </h3>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Arriving in Lahore by road or bus? You do not need to negotiate expensive long-distance taxis after a tiring journey. New Taj Palace Hotel is situated directly on Bund Road in Dholanwal, right across from the bus terminal. Step right into our cool, air-conditioned rooms and rest peacefully.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="https://share.google/piBoQEYODJrE0SZoK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
              >
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Get Directions in Google Maps</span>
              </a>
              <a
                href="tel:+923224845461"
                className="inline-flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4 text-neutral-600" />
                <span>Call Hotel Reception</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden border border-neutral-200 relative">
            {/* Embedded Google Maps View */}
            <iframe
              title="New Taj Palace Hotel Google Map Location"
              src="https://maps.google.com/maps?q=New%20Taj%20palace%20hotel%20near%20rahber%20travel%20opp%20city%20bus%20terminal%20bund%20road%20lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. Photo Gallery Preview */}
      {galleryPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-1">
                Visual Tour
              </span>
              <h2 className="font-serif text-3xl font-bold text-neutral-900">
                Hotel Photography
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-bold text-gold-700 hover:text-gold-800 flex items-center space-x-1"
            >
              <span>View Full Gallery</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {galleryPhotos.map((photo) => (
              <div key={photo.id} className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-sm group">
                <img
                  src={photo.image_url}
                  alt={photo.title || 'New Taj Palace Hotel Room'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. FAQs Preview */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-1">
              Need Help?
            </span>
            <h2 className="font-serif text-3xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm"
              >
                <h3 className="font-bold text-base text-neutral-900 mb-2 flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/faq"
              className="text-xs font-bold text-gold-700 hover:text-gold-800 underline underline-offset-4"
            >
              Have more questions? Read our full FAQ page
            </Link>
          </div>
        </section>
      )}

      {/* 8. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-charcoal-deep to-charcoal text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Ready to Book Your Stay in Lahore?
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Reserve your suite online in less than 2 minutes. Choose between Pay at Hotel upon arrival or seamless advance bank transfer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/book"
                prefetch={false}
                className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal font-bold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
              >
                Start Instant Reservation
              </Link>
              <a
                href="https://wa.me/923224845461"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base backdrop-blur-md transition-all border border-white/20"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Room Details & YouTube Walkthrough Modal */}
      {selectedModalRoom && (
        <RoomDetailsModal
          room={selectedModalRoom}
          onClose={() => setSelectedModalRoom(null)}
        />
      )}
    </div>
  );
}
