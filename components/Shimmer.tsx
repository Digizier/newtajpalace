"use client";

import React from 'react';

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className = 'h-64 w-full rounded-2xl' }: ShimmerProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-charcoal-light dark:via-charcoal dark:to-charcoal-light animate-pulse ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.8s_infinite]" />
    </div>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col">
      <Shimmer className="h-60 w-full" />
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Shimmer className="h-6 w-3/4 rounded-md" />
          <Shimmer className="h-4 w-full rounded-md" />
          <Shimmer className="h-4 w-2/3 rounded-md" />
        </div>
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <Shimmer className="h-7 w-28 rounded-md" />
          <Shimmer className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[480px] md:h-[620px] rounded-3xl overflow-hidden relative">
      <Shimmer className="w-full h-full" />
    </div>
  );
}
