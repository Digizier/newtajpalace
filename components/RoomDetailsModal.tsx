"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Users, 
  BedDouble, 
  Maximize2, 
  Check, 
  Video, 
  Image as ImageIcon, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import type { RoomCategory } from '@/lib/types';

interface RoomDetailsModalProps {
  room: RoomCategory | null;
  onClose: () => void;
}

// Helper to extract YouTube video ID and build clean embed URL
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i
  );
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }
  return null;
}

export default function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset tab and photo index whenever room changes
  useEffect(() => {
    setActiveMediaTab('photos');
    setSelectedPhotoIndex(0);
  }, [room]);

  if (!room) return null;

  // Build full photo list: featured_image first, followed by gallery_images
  const allPhotos: string[] = [
    room.featured_image || '/images/rooms/room-2.webp',
    ...(Array.isArray(room.gallery_images) ? room.gallery_images : []),
  ].filter(Boolean);

  const youtubeEmbedUrl = getYouTubeEmbedUrl(room.video_url);
  const status = room.status || 'available';

  const isAvailable = status === 'available';
  const isOccupied = status === 'occupied';
  const isMaintenance = status === 'maintenance';

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
                  {room.name}
                </h2>
                {room.is_featured && (
                  <span className="hidden sm:inline-flex items-center space-x-1 bg-gold-50 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gold-200">
                    <Sparkles className="w-3 h-3 text-gold-600" />
                    <span>Popular</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {room.bed_type} • Up to {room.max_adults} Adults {room.max_children > 0 ? `& ${room.max_children} Kids` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Live Status Badge */}
            {isAvailable && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available</span>
              </span>
            )}
            {isOccupied && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Occupied</span>
              </span>
            )}
            {isMaintenance && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
                <Wrench className="w-3.5 h-3.5 text-neutral-600" />
                <span>Maintenance</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-800 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Media Switcher: Photos vs YouTube Walkthrough */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('photos')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMediaTab === 'photos'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gold-600" />
                  <span>Photos ({allPhotos.length})</span>
                </button>

                {youtubeEmbedUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeMediaTab === 'video'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-neutral-600 hover:text-red-600'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>Watch Video Walkthrough</span>
                  </button>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Rate Per Night</span>
                <span className="font-serif text-lg sm:text-xl font-bold text-neutral-950">
                  Rs. {room.base_price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Display Area: Active Photo Slider OR Embedded YouTube Video */}
            {activeMediaTab === 'photos' ? (
              <div className="space-y-3">
                <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-black group select-none">
                  <img
                    src={allPhotos[selectedPhotoIndex] || allPhotos[0]}
                    alt={`${room.name} photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Previous / Next Controls */}
                  {allPhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevPhoto}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-90 hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={nextPhoto}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-90 hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Photo Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono font-semibold">
                    {selectedPhotoIndex + 1} / {allPhotos.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {allPhotos.length > 1 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
                    {allPhotos.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          selectedPhotoIndex === idx
                            ? 'border-gold-500 scale-95 ring-2 ring-gold-500/30'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* YouTube Video Embed Player */
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-neutral-800">
                {youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${room.name} Video Walkthrough`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
                    No video walkthrough available for this suite.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Room Specs & Key Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sand-light p-4 rounded-2xl border border-sand-dark text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Bed Type</span>
              <span className="font-bold text-neutral-900">{room.bed_type}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Max Guests</span>
              <span className="font-bold text-neutral-900">{room.max_adults} Adults {room.max_children > 0 ? `+ ${room.max_children} Kids` : ''}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Room Size</span>
              <span className="font-bold text-neutral-900">{room.room_size || '320 sq. ft.'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Daily Housekeeping</span>
              <span className="font-bold text-neutral-900">Complimentary</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Suite Overview & Features</h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {room.description || room.short_desc}
            </p>
          </div>

          {/* Amenities Grid */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Included Room Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.amenities.map((am) => (
                  <div key={am} className="flex items-center space-x-2 text-xs text-neutral-700 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Notices */}
          {isOccupied && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Notice: This Suite is Currently Occupied</span>
              </div>
              <p className="text-amber-800/90 leading-relaxed">
                This room is occupied by guests. Instant online checkout is temporarily paused for this suite. Please contact our reception on WhatsApp for next checkout dates or to join our priority room waitlist.
              </p>
            </div>
          )}

          {isMaintenance && (
            <div className="bg-neutral-100 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-800 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-neutral-900">
                <Wrench className="w-4 h-4 text-neutral-700" />
                <span>Under Scheduled Maintenance</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                This suite is undergoing routine sanitization and upgrade maintenance to maintain our luxury standards. Please message our reservation desk on WhatsApp for suitable alternatives.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Current Rate</span>
            <div className="flex items-baseline space-x-1">
              <span className="font-serif text-lg sm:text-2xl font-bold text-neutral-950">
                Rs. {room.base_price.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAvailable ? (
              <>
                <a
                  href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I am inquiring about booking the "${room.name}" (Rs. ${room.base_price.toLocaleString()}/night).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Inquiry</span>
                </a>
                <Link
                  href={`/book?room=${room.slug}`}
                  onClick={onClose}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Book This Suite</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            ) : isOccupied ? (
              <a
                href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I see that the "${room.name}" is currently marked as OCCUPIED. Could you please let me know when it will be available next?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire on WhatsApp (Occupied)</span>
              </a>
            ) : (
              <a
                href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I see that the "${room.name}" is under MAINTENANCE. Please advise on available alternative rooms.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact on WhatsApp (Maintenance)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
