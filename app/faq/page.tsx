"use client";

import React, { useState, useEffect } from 'react';
import { getFAQs } from '@/lib/db';
import type { FAQ } from '@/lib/types';
import { HelpCircle, ChevronDown, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { Shimmer } from '@/components/Shimmer';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error('FAQ loading error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
          Help & Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
          Find instant answers to common questions about booking, payments, location on Bund Road, check-in rules, and facilities.
        </p>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-20 rounded-2xl w-full" />
          ))
        ) : faqs.length === 0 ? (
          <p className="text-center text-sm text-neutral-500 py-10">No FAQs available.</p>
        ) : (
          faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-neutral-900 flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-gold-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pl-14">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-gradient-to-r from-gold-50 to-ivory rounded-3xl p-8 border border-gold-200 text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-neutral-900">
          Have a Question Not Answered Here?
        </h3>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          Our front desk staff is available 24/7. Feel free to contact us on WhatsApp or phone for immediate assistance with your reservation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/923224845461"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (0322 4845461)</span>
          </a>
          <a
            href="tel:+923224845461"
            className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
          >
            <Phone className="w-4 h-4 text-gold-400" />
            <span>Call Reception</span>
          </a>
        </div>
      </div>
    </div>
  );
}
