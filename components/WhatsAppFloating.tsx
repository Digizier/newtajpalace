"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingProps {
  roomName?: string;
  bookingRef?: string;
}

export default function WhatsAppFloating({ roomName, bookingRef }: WhatsAppFloatingProps) {
  const phoneNumber = '923224845461';

  let message = 'Hello New Taj Palace Hotel! I would like to inquire about room availability and reservations.';
  if (roomName) {
    message = `Hello New Taj Palace Hotel! I am interested in booking the "${roomName}". Could you please share rate and availability details?`;
  } else if (bookingRef) {
    message = `Hello New Taj Palace Hotel! I am contacting regarding my booking reference "${bookingRef}".`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-20 md:bottom-8 right-5 md:right-8 z-40 flex items-center group"
    >
      <div className="hidden md:flex items-center bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-neutral-100 mr-3 text-xs font-semibold text-neutral-800 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        Chat with Front Desk
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with New Taj Palace Hotel"
        className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-600/30 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
}
