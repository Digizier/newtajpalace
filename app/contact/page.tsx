"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { sendContactMessage } from '@/lib/db';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrorMessage('');

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setErrorMessage('Failed to send message. Please reach out to us directly on WhatsApp or call our phone.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Contact New Taj Palace Hotel
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Have an inquiry about room availability, group bookings, or need directions from the City Bus Terminal? We are here to help 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Hotel Information
            </h3>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-neutral-400">Location Address</h4>
                <p className="text-sm font-semibold text-neutral-900 mt-1 leading-relaxed">
                  Near Rahber Travel, Opp City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan
                </p>
                <a
                  href="https://share.google/piBoQEYODJrE0SZoK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-gold-600 hover:text-gold-700 underline mt-1.5 inline-block"
                >
                  Open in Google Maps ➔
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-neutral-400">Reception Desk</h4>
                <a href="tel:+923224845461" className="text-sm font-semibold text-neutral-900 mt-1 block hover:text-gold-600">
                  +92 322 4845461
                </a>
                <span className="text-[11px] text-neutral-500">Available 24 Hours Daily</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-neutral-400">WhatsApp Helpdesk</h4>
                <a
                  href="https://wa.me/923224845461"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-neutral-900 mt-1 block hover:text-emerald-600"
                >
                  0322 4845461
                </a>
                <span className="text-[11px] text-neutral-500">Instant Chat & Room Inquiries</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-neutral-400">Official Email</h4>
                <a href="mailto:yasinjimi4u84@gmail.com" className="text-sm font-semibold text-neutral-900 mt-1 block hover:text-gold-600 break-all">
                  yasinjimi4u84@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-charcoal text-white rounded-3xl p-6 border border-charcoal-border">
            <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Standard Timings</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-white/10">
              <span className="text-neutral-400">Check-in:</span>
              <span className="font-bold">From 02:00 PM</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-neutral-400">Check-out:</span>
              <span className="font-bold">Until 12:00 PM</span>
            </div>
          </div>
        </div>

        {/* Contact Form & Map (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
              Send an Online Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Fill in your details below and our front desk will reply promptly.
            </p>

            {success ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-neutral-900">Message Received!</h4>
                <p className="text-xs text-neutral-600">
                  Thank you for reaching out. We have logged your inquiry and will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs font-bold text-emerald-700 underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-full-name" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-full-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone-number" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="contact-phone-number"
                      type="tel"
                      required
                      placeholder="0322 4845461"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email-address" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      id="contact-email-address"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-inquiry-subject" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Subject
                    </label>
                    <input
                      id="contact-inquiry-subject"
                      type="text"
                      placeholder="e.g. Family Room for 4 Persons"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-inquiry-message" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-inquiry-message"
                    required
                    rows={4}
                    placeholder="Tell us about your dates, number of guests, or any special requests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs font-semibold text-red-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Embedded Google Maps */}
          <div className="h-72 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm relative">
            <iframe
              title="New Taj Palace Hotel Map"
              src="https://maps.google.com/maps?q=New%20Taj%20palace%20hotel%20near%20rahber%20travel%20opp%20city%20bus%20terminal%20bund%20road%20lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
