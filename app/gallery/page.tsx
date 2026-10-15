"use client";

import React, { useState, useEffect } from 'react';
import { getGalleryItems } from '@/lib/db';
import type { GalleryItem } from '@/lib/types';
import { Filter, Eye, X } from 'lucide-react';
import { Shimmer } from '@/components/Shimmer';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Rooms', 'Bathrooms', 'Reception', 'Exterior'];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getGalleryItems(activeCategory);
        setItems(data);
      } catch (err) {
        console.error('Gallery loading error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory]);

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          Visual Showcase
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Hotel Photo Gallery
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base mt-3">
          Explore genuine photographs of New Taj Palace Hotel, Lahore. Discover our well-appointed bedrooms, spotless private washrooms, and welcoming reception.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-charcoal text-white shadow-md'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Shimmer key={i} className="h-64 rounded-2xl w-full" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-neutral-100 p-8">
            <p className="text-neutral-500 text-sm">No photos found in this category.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="relative h-64 rounded-2xl overflow-hidden shadow-sm group cursor-pointer bg-charcoal"
            >
              <img
                src={item.image_url}
                alt={item.title || 'New Taj Palace Hotel Room'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <span className="self-end bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gold-300">
                  {item.category}
                </span>
                <div>
                  <h4 className="font-serif font-bold text-sm">{item.title || 'Hotel View'}</h4>
                  <p className="text-[10px] text-neutral-300 flex items-center space-x-1 mt-0.5">
                    <Eye className="w-3 h-3" />
                    <span>Click to expand</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-2 text-white hover:text-gold-400 bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl relative">
            <img
              src={activePhoto.image_url}
              alt={activePhoto.title || 'Enlarged photo'}
              className="w-full h-full object-contain max-h-[80vh]"
            />
            {activePhoto.title && (
              <div className="p-3 bg-charcoal-deep text-white text-center text-xs font-semibold">
                {activePhoto.title}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
