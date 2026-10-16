"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  BedDouble, 
  Utensils, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Clock, 
  Sparkles, 
  AlertCircle,
  FileText,
  Printer,
  X,
  Video,
  Wrench,
  Eye
} from 'lucide-react';
import RoomDetailsModal from '@/components/RoomDetailsModal';
import InvoiceSlip from '@/components/InvoiceSlip';
import { 
  getAllAdminRoomCategories, 
  getActiveMealAddons, 
  validatePromoCode, 
  createBooking, 
  getHotelSettings,
  uploadMediaFile
} from '@/lib/db';
import type { 
  RoomCategory, 
  MealAddon, 
  Booking, 
  BookingMealSelection, 
  HotelSettings 
} from '@/lib/types';
import CustomModal from '@/components/CustomModal';

function BookingEngineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard Phases: 1 to 6
  const [currentPhase, setCurrentPhase] = useState(1);

  // Data states
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [mealAddons, setMealAddons] = useState<MealAddon[]>([]);
  const [hotelSettings, setHotelSettings] = useState<HotelSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Date States
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || tomorrow);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 2);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);

  // Selected Room
  const [selectedRoom, setSelectedRoom] = useState<RoomCategory | null>(null);
  const [modalRoom, setModalRoom] = useState<RoomCategory | null>(null);

  // Selected Meal Add-ons: Map of addonCode -> { adults: number, children: number }
  const [selectedAddons, setSelectedAddons] = useState<Record<string, { adults: number; children: number }>>({});

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  // Guest Information (Phase 4)
  const [guestName, setGuestName] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Review Modal (Phase 5)
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Payment Selection (Phase 6)
  const [paymentMethod, setPaymentMethod] = useState<'pay_at_hotel' | 'bank_transfer'>('pay_at_hotel');
  const [transferProofFile, setTransferProofFile] = useState<File | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showInvoiceSlipModal, setShowInvoiceSlipModal] = useState(false);

  // Load initial data from Supabase
  useEffect(() => {
    async function init() {
      try {
        const [roomsData, mealsData, settingsData] = await Promise.all([
          getAllAdminRoomCategories(),
          getActiveMealAddons(),
          getHotelSettings()
        ]);
        setRooms(roomsData);
        setMealAddons(mealsData);
        setHotelSettings(settingsData);

        // Preselect room from URL param if available
        const roomParam = searchParams.get('room');
        if (roomParam && roomsData.length > 0) {
          const found = roomsData.find(r => r.slug === roomParam);
          if (found) setSelectedRoom(found);
        } else if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }
      } catch (err) {
        console.error('Failed to initialize booking engine:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [searchParams]);

  // Calculations
  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Room Total
  const roomTotal = useMemo(() => {
    if (!selectedRoom) return 0;
    return selectedRoom.base_price * nights;
  }, [selectedRoom, nights]);

  // Addons Total
  const addonsTotal = useMemo(() => {
    let total = 0;
    Object.entries(selectedAddons).forEach(([code, counts]) => {
      const addon = mealAddons.find(m => m.code === code);
      if (addon) {
        const perNight = (counts.adults * addon.price_adult) + (counts.children * addon.price_child);
        total += perNight * nights;
      }
    });
    return total;
  }, [selectedAddons, mealAddons, nights]);

  // Subtotal before discounts
  const subtotal = roomTotal + addonsTotal;

  // Discount
  const discountTotal = appliedPromo ? appliedPromo.discount : 0;

  // Taxes
  const taxPercentage = hotelSettings?.tax_percentage || 0;
  const taxTotal = Math.round((Math.max(subtotal - discountTotal, 0) * taxPercentage) / 100);

  // Grand Total
  const grandTotal = Math.max(subtotal - discountTotal + taxTotal, 0);

  // Payment Distribution (Payable Now vs Due at Check-in)
  const payableNow = paymentMethod === 'bank_transfer' ? grandTotal : 0;
  const dueAtCheckin = grandTotal - payableNow;

  // Handle Promo Validation
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    setPromoMessage(null);
    try {
      const res = await validatePromoCode(promoInput, subtotal);
      if (res.valid) {
        setAppliedPromo({ code: promoInput.toUpperCase(), discount: res.discount });
        setPromoMessage({ text: res.message, isError: false });
      } else {
        setAppliedPromo(null);
        setPromoMessage({ text: res.message, isError: true });
      }
    } catch {
      setPromoMessage({ text: 'Error verifying promo code', isError: true });
    } finally {
      setValidatingPromo(false);
    }
  };

  // Addon Toggle
  const updateAddonCounts = (code: string, type: 'adults' | 'children', delta: number) => {
    setSelectedAddons(prev => {
      const current = prev[code] || { adults: 0, children: 0 };
      const nextVal = Math.max(0, current[type] + delta);
      return {
        ...prev,
        [code]: { ...current, [type]: nextVal }
      };
    });
  };

  // Final Booking Submission (Phase 6)
  const handleConfirmReservation = async () => {
    if (!selectedRoom) return;
    setSubmittingBooking(true);

    try {
      // Build selected addons payload
      const mealSelections: BookingMealSelection[] = Object.entries(selectedAddons)
        .filter(([, counts]) => counts.adults > 0 || counts.children > 0)
        .map(([code, counts]) => {
          const addon = mealAddons.find(m => m.code === code)!;
          return {
            code,
            name: addon.name,
            adults_count: counts.adults,
            children_count: counts.children,
            price_adult: addon.price_adult,
            price_child: addon.price_child,
            total_per_night: (counts.adults * addon.price_adult) + (counts.children * addon.price_child),
          };
        });

      // Submit booking to Supabase
      const newBooking = await createBooking({
        room_category_id: selectedRoom.id,
        room_category_name: selectedRoom.name,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        adults,
        children,
        num_rooms: 1,
        guest_name: guestName.trim(),
        guest_phone: `${countryCode} ${guestPhone.trim()}`,
        guest_email: guestEmail.trim(),
        special_requests: specialRequests.trim() || undefined,
        meal_addons_selected: mealSelections,
        room_total: roomTotal,
        addons_total: addonsTotal,
        discount_total: discountTotal,
        tax_total: taxTotal,
        grand_total: grandTotal,
        payable_now: payableNow,
        due_at_checkin: dueAtCheckin,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'pay_at_hotel' ? 'unpaid' : 'under_review',
        booking_status: 'pending_review',
      });

      // If user uploaded a transfer proof file, process and upload it
      if (paymentMethod === 'bank_transfer' && transferProofFile) {
        try {
          const proofUrl = await uploadMediaFile(transferProofFile, 'proofs');
          // Update payment proof reference
          console.log('Proof uploaded:', proofUrl);
        } catch (proofErr) {
          console.error('Error uploading payment proof:', proofErr);
        }
      }

      setCreatedBooking(newBooking);
      setCurrentPhase(6); // Move to final completed screen
    } catch (err) {
      console.error('Failed to create booking:', err);
      setBookingError('There was an issue processing your booking request. Please try again or contact the front desk directly at +92 322 4845461.');
    } finally {
      setSubmittingBooking(false);
      setShowReviewModal(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Booking Error Banner (No alert/localhost popup) */}
      {bookingError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{bookingError}</span>
          </div>
          <button onClick={() => setBookingError(null)} className="text-red-500 hover:text-red-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Step Indicator Header */}
      <div className="mb-8 no-print">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-1">
          Online Room Reservation Engine
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900">
          Book Your Stay at New Taj Palace
        </h1>

        {/* 6-Phase Step Bar */}
        <div className="mt-6 flex items-center justify-between border-b border-neutral-200 pb-4 overflow-x-auto">
          {[
            { num: 1, label: 'Room Suite' },
            { num: 2, label: 'Meal Extras' },
            { num: 3, label: 'Cost & Promo' },
            { num: 4, label: 'Guest Details' },
            { num: 5, label: 'Confirmation' },
          ].map((st) => (
            <div
              key={st.num}
              className={`flex items-center space-x-2 text-xs font-bold whitespace-nowrap px-2 ${
                currentPhase === st.num
                  ? 'text-gold-600 border-b-2 border-gold-600 pb-2 -mb-4'
                  : currentPhase > st.num
                  ? 'text-neutral-900'
                  : 'text-neutral-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                currentPhase === st.num
                  ? 'bg-gold-500 text-white shadow-sm'
                  : currentPhase > st.num
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {currentPhase > st.num ? '✓' : st.num}
              </div>
              <span className="hidden sm:inline">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${currentPhase === 6 ? 'max-w-4xl mx-auto' : 'lg:grid-cols-12'} gap-8 items-start`}>
        {/* Main Workflow Form Area */}
        <div className={`${currentPhase === 6 ? 'w-full' : 'lg:col-span-8'} bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm`}>
          {/* ========================================================= */}
          {/* PHASE 1: Room Selection & Date Availability */}
          {/* ========================================================= */}
          {currentPhase === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Phase 1: Choose Your Dates & Room Suite
              </h2>

              {/* Date & Guest Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div>
                  <label htmlFor="check-in-phase1" className="text-xs font-bold text-neutral-500 uppercase block mb-1">Check-In</label>
                  <input
                    id="check-in-phase1"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="check-out-phase1" className="text-xs font-bold text-neutral-500 uppercase block mb-1">Check-Out</label>
                  <input
                    id="check-out-phase1"
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="adults-phase1" className="text-xs font-bold text-neutral-500 uppercase block mb-1">Adults</label>
                  <select
                    id="adults-phase1"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="children-phase1" className="text-xs font-bold text-neutral-500 uppercase block mb-1">Children</label>
                  <select
                    id="children-phase1"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold"
                  >
                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>)}
                  </select>
                </div>
              </div>

              {/* Room Cards List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
                  Select Room Category ({rooms.length} Suites Available)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    const roomStatus = room.status || 'available';
                    const isAvailable = roomStatus === 'available';
                    const isOccupied = roomStatus === 'occupied';
                    const isMaintenance = roomStatus === 'maintenance';
                    const galleryCount = (Array.isArray(room.gallery_images) ? room.gallery_images.length : 0);

                    // Group fit calculations
                    const maxAdults = room.max_adults || 2;
                    const maxKids = room.max_children ?? 0;
                    const fitsAdults = adults <= maxAdults;
                    const fitsKids = children <= maxKids;
                    const fitsGroup = fitsAdults && fitsKids;

                    return (
                      <div
                        key={room.id}
                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/20 shadow-md ring-2 ring-gold-500/20'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div>
                          {/* Image & Quick View Trigger */}
                          <div
                            onClick={() => setModalRoom(room)}
                            className="relative h-44 rounded-2xl overflow-hidden mb-3 cursor-pointer group"
                            title="Click to view full photos and walkthrough video"
                          >
                            <img
                              src={room.featured_image || '/images/rooms/room-2.webp'}
                              alt={room.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Price Badge */}
                            <div className="absolute top-2 right-2 bg-charcoal/85 backdrop-blur-sm text-gold-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow">
                              Rs. {room.base_price.toLocaleString()} / nt
                            </div>

                            {/* Status Badges */}
                            <div className="absolute top-2 left-2 flex flex-col space-y-1">
                              {isAvailable && (
                                <span className="inline-flex items-center space-x-1 bg-emerald-950/85 backdrop-blur-sm text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Available</span>
                                </span>
                              )}
                              {isOccupied && (
                                <span className="inline-flex items-center space-x-1 bg-amber-950/85 backdrop-blur-sm text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <AlertCircle className="w-3 h-3 text-amber-400" />
                                  <span>Occupied</span>
                                </span>
                              )}
                              {isMaintenance && (
                                <span className="inline-flex items-center space-x-1 bg-neutral-900/85 backdrop-blur-sm text-neutral-300 border border-neutral-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  <Wrench className="w-3 h-3 text-neutral-400" />
                                  <span>Maintenance</span>
                                </span>
                              )}
                            </div>

                            {/* View Details Pill Overlay */}
                            <div className="absolute bottom-2 right-2 bg-black/75 hover:bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5 shadow">
                              <Eye className="w-3.5 h-3.5 text-gold-400" />
                              <span>Photos & Video</span>
                            </div>

                            {/* Media indicators */}
                            <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-[10px] font-bold text-white">
                              {galleryCount > 0 && (
                                <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                                  {galleryCount + 1} Photos
                                </span>
                              )}
                              {room.video_url && (
                                <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-red-400 flex items-center space-x-1">
                                  <Video className="w-3 h-3" />
                                  <span>Video</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <h4 
                              onClick={() => setModalRoom(room)}
                              className="font-serif font-bold text-base sm:text-lg text-neutral-900 hover:text-gold-700 transition-colors cursor-pointer"
                            >
                              {room.name}
                            </h4>
                          </div>

                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{room.short_desc}</p>
                          
                          {/* Room Capacity Specs */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 mt-2.5">
                            <span className="font-semibold text-neutral-700">Max {maxAdults} Adults</span>
                            <span>•</span>
                            <span className="font-semibold text-neutral-700">{maxKids} Kids</span>
                            <span>•</span>
                            <span>{room.bed_type}</span>
                            {room.room_size && (
                              <>
                                <span>•</span>
                                <span>{room.room_size}</span>
                              </>
                            )}
                          </div>

                          {/* Group Suitability Indicator (Synced dynamically with Adults & Children custom selectors) */}
                          <div className="mt-2.5">
                            {fitsGroup ? (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>Fits Your Group ({adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Kid${children > 1 ? 's' : ''}` : ''})</span>
                              </div>
                            ) : !fitsAdults ? (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span>You selected {adults} Adults (Suite accommodates max {maxAdults})</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span>You selected {children} Kids (Suite accommodates max {maxKids})</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Amenities Chips */}
                          {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {room.amenities.slice(0, 3).map((amenity, i) => (
                                <span key={i} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-medium">
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities.length > 3 && (
                                <span className="text-[10px] bg-neutral-100 text-gold-700 px-1.5 py-0.5 rounded-md font-semibold">
                                  +{room.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-neutral-400">Total for {nights} night{nights > 1 ? 's' : ''}</span>
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 font-serif">
                              Rs. {(room.base_price * nights).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setModalRoom(room)}
                              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-colors"
                            >
                              Photos & Video
                            </button>

                            {isAvailable ? (
                              isSelected ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setCurrentPhase(2);
                                  }}
                                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
                                >
                                  <span>Proceed to Meals</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedRoom(room)}
                                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-colors"
                                >
                                  Select Suite
                                </button>
                              )
                            ) : isOccupied ? (
                              <a
                                href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace! I am interested in "${room.name}", which shows Occupied online.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                              >
                                Occupied (Inquire)
                              </a>
                            ) : (
                              <a
                                href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace! I am asking about "${room.name}", currently under maintenance.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-neutral-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                              >
                                Maintenance
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advance Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(2)}
                  disabled={!selectedRoom}
                  className="bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Proceed to Meal Add-ons</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 2: Customizing Meal Add-ons & Extras */}
          {/* ========================================================= */}
          {currentPhase === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                  Phase 2: Customizing Meal Add-ons & Extras
                </h2>
                <span className="text-xs text-neutral-400">Optional Services</span>
              </div>

              <p className="text-sm text-neutral-600">
                Enhance your stay at New Taj Palace with fresh meals served in your room, shuttle transit, or extra bedding. All rates update dynamically.
              </p>

              <div className="space-y-4">
                {mealAddons.map((addon) => {
                  const counts = selectedAddons[addon.code] || { adults: 0, children: 0 };
                  const isChecked = counts.adults > 0 || counts.children > 0;

                  return (
                    <div
                      key={addon.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isChecked ? 'border-gold-500 bg-gold-50/10 shadow-sm' : 'border-neutral-200 bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-base text-neutral-900">{addon.name}</h4>
                          <p className="text-xs text-neutral-500 max-w-md">{addon.description}</p>
                          <div className="flex items-center space-x-3 text-xs font-semibold text-gold-700 pt-1">
                            <span>Adult: Rs. {addon.price_adult.toLocaleString()}</span>
                            {addon.price_child > 0 && (
                              <>
                                <span>•</span>
                                <span>Child: Rs. {addon.price_child.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Guest Count Increments */}
                        <div className="flex items-center space-x-4 bg-white p-2.5 rounded-xl border border-neutral-200">
                          {/* Adult Counter */}
                          <div className="text-center">
                            <span className="text-[10px] text-neutral-400 font-bold block uppercase">Adults</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <button
                                type="button"
                                onClick={() => updateAddonCounts(addon.code, 'adults', -1)}
                                className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 font-bold hover:bg-neutral-200 flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{counts.adults}</span>
                              <button
                                type="button"
                                onClick={() => updateAddonCounts(addon.code, 'adults', 1)}
                                className="w-7 h-7 rounded-lg bg-gold-500 text-white font-bold hover:bg-gold-600 flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Child Counter (if applicable) */}
                          {addon.price_child > 0 && (
                            <div className="text-center border-l pl-3 border-neutral-200">
                              <span className="text-[10px] text-neutral-400 font-bold block uppercase">Kids</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => updateAddonCounts(addon.code, 'children', -1)}
                                  className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 font-bold hover:bg-neutral-200 flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{counts.children}</span>
                                <button
                                  type="button"
                                  onClick={() => updateAddonCounts(addon.code, 'children', 1)}
                                  className="w-7 h-7 rounded-lg bg-gold-500 text-white font-bold hover:bg-gold-600 flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(1)}
                  className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center space-x-2 hover:bg-neutral-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Room Selection</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPhase(3)}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Review Cost & Discounts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 3: Detailed Cost Breakdown & Promo Codes */}
          {/* ========================================================= */}
          {currentPhase === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Phase 3: Itemized Cost Breakdown & Promo Discounts
              </h2>

              {/* Itemized Table */}
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-neutral-700">
                    {selectedRoom?.name} ({nights} Night{nights > 1 ? 's' : ''})
                  </span>
                  <span className="font-bold text-neutral-900">
                    Rs. {roomTotal.toLocaleString()}
                  </span>
                </div>

                {Object.entries(selectedAddons).map(([code, counts]) => {
                  if (counts.adults === 0 && counts.children === 0) return null;
                  const addon = mealAddons.find(m => m.code === code);
                  if (!addon) return null;
                  const itemTotal = ((counts.adults * addon.price_adult) + (counts.children * addon.price_child)) * nights;
                  return (
                    <div key={code} className="flex justify-between text-xs text-neutral-600 pl-3 border-l-2 border-gold-400">
                      <span>{addon.name} ({counts.adults}A, {counts.children}C × {nights}nt)</span>
                      <span className="font-medium text-neutral-800">Rs. {itemTotal.toLocaleString()}</span>
                    </div>
                  );
                })}

                {discountTotal > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-emerald-600 pt-2 border-t border-neutral-200">
                    <span>Discount Code ({appliedPromo?.code})</span>
                    <span>- Rs. {discountTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-serif text-lg font-bold text-neutral-900">Total Bill</span>
                  <span className="font-serif text-2xl font-bold text-gold-600">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code Input Box */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2">
                <label htmlFor="promo-voucher-input" className="text-xs font-bold text-neutral-600 uppercase tracking-wider block">
                  Have a Promo Code or Voucher?
                </label>
                <div className="flex space-x-2">
                  <input
                    id="promo-voucher-input"
                    type="text"
                    placeholder="Enter code (e.g. WELCOME10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || !promoInput.trim()}
                    className="bg-charcoal hover:bg-neutral-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
                  >
                    {validatingPromo ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs font-semibold mt-1.5 ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(2)}
                  className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center space-x-2 hover:bg-neutral-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Extras</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPhase(4)}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Enter Guest Information</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 4: Guest Information & Special Instructions */}
          {/* ========================================================= */}
          {currentPhase === 4 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Phase 4: Guest Contact Details
              </h2>

              <p className="text-sm text-neutral-600">
                Please enter the primary guest information. Your reservation voucher will be sent to the email provided below.
              </p>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="guest-full-name" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Full Name (First and Last) *
                  </label>
                  <input
                    id="guest-full-name"
                    type="text"
                    required
                    placeholder="e.g. Muhammad Usman"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Phone with Country Code */}
                <div>
                  <label htmlFor="guest-mobile-phone" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Mobile Phone Number (WhatsApp preferred) *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      aria-label="Country Dialing Code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-3 text-sm font-bold w-28 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="+92">PK (+92)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+966">KSA (+966)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+1">USA (+1)</option>
                    </select>
                    <input
                      id="guest-mobile-phone"
                      type="tel"
                      required
                      placeholder="322 4845461"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="guest-email-address" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Email Address (For Confirmation Voucher) *
                  </label>
                  <input
                    id="guest-email-address"
                    type="email"
                    required
                    placeholder="usman@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="guest-special-requests" className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Special Requests or Arrival Notes (Optional)
                  </label>
                  <textarea
                    id="guest-special-requests"
                    rows={3}
                    placeholder="e.g. Arriving late evening from bus terminal, ground floor room preferred..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      className="mt-1 w-4 h-4 text-gold-500 rounded border-neutral-300 focus:ring-gold-500"
                    />
                    <span className="text-xs text-neutral-600 leading-relaxed">
                      I agree to the hotel check-in requirements (valid CNIC/Passport required) and acknowledge the 24-hour cancellation policy.
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(3)}
                  className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center space-x-2 hover:bg-neutral-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pricing</span>
                </button>

                <button
                  type="button"
                  disabled={!guestName.trim() || !guestPhone.trim() || !guestEmail.trim() || !agreedToPolicy}
                  onClick={() => setShowReviewModal(true)}
                  className="bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Review Reservation Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 5: Pre-Payment Review Popup Modal */}
          {/* ========================================================= */}
          <CustomModal
            isOpen={showReviewModal}
            title="Review Your Booking"
            message={`Please confirm your dates: ${checkIn} to ${checkOut} (${nights} nights) in the ${selectedRoom?.name} for ${guestName}. Total payable: Rs. ${grandTotal.toLocaleString()}.`}
            type="confirm"
            confirmText="Proceed to Payment Selection"
            cancelText="Make Changes"
            onConfirm={() => {
              setShowReviewModal(false);
              setCurrentPhase(5);
            }}
            onCancel={() => setShowReviewModal(false)}
          />

          {/* ========================================================= */}
          {/* PHASE 5 SCREEN: Payment Method Selection */}
          {/* ========================================================= */}
          {currentPhase === 5 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Phase 5: Select Payment Method
              </h2>

              <p className="text-sm text-neutral-600">
                Choose how you would like to handle your reservation payment. You can pay cash upon arrival at the hotel or pay in advance via bank transfer / mobile wallet.
              </p>

              <div className="space-y-4">
                {/* Option 1: Pay at Hotel */}
                <div
                  onClick={() => setPaymentMethod('pay_at_hotel')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'pay_at_hotel'
                      ? 'border-gold-500 bg-gold-50/20 shadow-sm'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-6 h-6 text-gold-600" />
                      <div>
                        <h4 className="font-bold text-neutral-900">Pay at Hotel (Cash on Arrival)</h4>
                        <p className="text-xs text-neutral-500">Pay Rs. {grandTotal.toLocaleString()} directly at the front desk when you check in.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">No Advance Required</span>
                  </div>
                </div>

                {/* Option 2: Bank Transfer / JazzCash / EasyPaisa */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-gold-500 bg-gold-50/20 shadow-sm'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-gold-600" />
                      <div>
                        <h4 className="font-bold text-neutral-900">Advance Bank Transfer / Mobile Wallet</h4>
                        <p className="text-xs text-neutral-500">Transfer directly to Meezan Bank, JazzCash, or EasyPaisa account.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-600">Instant Verification</span>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-4 border-t border-neutral-200/80 space-y-3 bg-neutral-50 p-4 rounded-xl text-xs text-neutral-700">
                      <div className="font-bold text-neutral-900">Official Hotel Payment Accounts:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Official Bank Account */}
                        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                            <span className="font-bold text-xs text-neutral-900">{hotelSettings?.bank_name || 'Bank Account'}</span>
                            <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded font-semibold">Bank</span>
                          </div>
                          <div><span className="text-neutral-500 text-[10px] block">Account Title:</span><span className="font-semibold text-neutral-900">{hotelSettings?.bank_account_title}</span></div>
                          <div><span className="text-neutral-500 text-[10px] block">A/C Number:</span><span className="font-mono font-bold text-neutral-900">{hotelSettings?.bank_account_number}</span></div>
                          <div><span className="text-neutral-500 text-[10px] block">IBAN:</span><span className="font-mono text-[10px] text-neutral-600 break-all">{hotelSettings?.bank_iban}</span></div>
                        </div>

                        {/* 2. JazzCash Mobile Wallet */}
                        <div className="bg-white p-3.5 rounded-xl border border-red-100 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                            <span className="font-bold text-xs text-red-600">JazzCash</span>
                            <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-semibold">Wallet</span>
                          </div>
                          <div><span className="text-neutral-500 text-[10px] block">Account Title:</span><span className="font-semibold text-neutral-900">{hotelSettings?.jazzcash_title || hotelSettings?.hotel_name}</span></div>
                          <div><span className="text-neutral-500 text-[10px] block">Account / Mobile:</span><span className="font-mono font-bold text-neutral-900">{hotelSettings?.jazzcash_number}</span></div>
                        </div>

                        {/* 3. EasyPaisa Mobile Wallet */}
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-1.5 shadow-sm">
                          <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                            <span className="font-bold text-xs text-emerald-600">EasyPaisa</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Wallet</span>
                          </div>
                          <div><span className="text-neutral-500 text-[10px] block">Account Title:</span><span className="font-semibold text-neutral-900">{hotelSettings?.easypaisa_title || hotelSettings?.hotel_name}</span></div>
                          <div><span className="text-neutral-500 text-[10px] block">Account / Mobile:</span><span className="font-mono font-bold text-neutral-900">{hotelSettings?.easypaisa_number}</span></div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <label htmlFor="proof-receipt-file" className="block font-bold text-neutral-700 mb-1">
                          Upload Payment Receipt / Screenshot (Optional)
                        </label>
                        <input
                          id="proof-receipt-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setTransferProofFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Final Action */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(4)}
                  className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center space-x-2 hover:bg-neutral-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Guest Details</span>
                </button>

                <button
                  type="button"
                  disabled={submittingBooking}
                  onClick={handleConfirmReservation}
                  className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center space-x-2 shadow-lg shadow-gold-500/20 active:scale-95 transition-all"
                >
                  {submittingBooking ? (
                    <span>Processing Reservation...</span>
                  ) : (
                    <>
                      <span>Complete Reservation</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 6: Reservation Completed & Printable Voucher View */}
          {/* ========================================================= */}
          {currentPhase === 6 && createdBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm no-print">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="no-print space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Reservation Successfully Registered
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                  Thank You, {createdBooking.guest_name}!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
                  Your official reservation reference is <strong className="text-gold-700 font-mono text-base">{createdBooking.reference}</strong>. Your printable confirmation slip has been generated below.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 no-print">
                <button
                  type="button"
                  onClick={() => setShowInvoiceSlipModal(true)}
                  className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-md active:scale-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>View & Print Official Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-sm active:scale-95 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip Directly</span>
                </button>

                <a
                  href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel! I have submitted booking reference ${createdBooking.reference} for ${createdBooking.guest_name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center space-x-2 shadow-sm active:scale-95 transition-all"
                >
                  <span>Notify on WhatsApp</span>
                </a>

                <Link
                  href="/"
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-5 py-3 rounded-xl text-xs transition-all"
                >
                  Return to Home
                </Link>
              </div>

              {/* Printable Invoice Slip Component */}
              <div className="pt-4">
                <InvoiceSlip booking={createdBooking} hotelSettings={hotelSettings} />
              </div>

              {/* Dedicated Invoice Slip Modal for isolated view */}
              {showInvoiceSlipModal && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
                  <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl overflow-hidden p-0">
                    <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-900 shrink-0">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">Official Hotel Voucher</span>
                        <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                          Reservation Voucher #{createdBooking.reference}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Slip Now</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInvoiceSlipModal(false)}
                          className="text-neutral-400 hover:text-white p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-neutral-950">
                      <InvoiceSlip booking={createdBooking} hotelSettings={hotelSettings} />
                    </div>

                    <div className="p-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 bg-neutral-900 shrink-0">
                      <span className="text-[11px]">Only the official reservation voucher slip will be printed. Zero website background information.</span>
                      <button
                        type="button"
                        onClick={() => setShowInvoiceSlipModal(false)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* Right Sticky Sidebar: Real-Time Summary Tracking */}
        {/* ========================================================= */}
        {currentPhase !== 6 && (
          <div className="lg:col-span-4 sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-xl space-y-5 no-print">
            <div className="pb-4 border-b border-neutral-100">
              <span className="text-xs uppercase tracking-wider text-gold-600 font-bold block mb-1">
                Reservation Summary
              </span>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                {selectedRoom ? selectedRoom.name : 'Choose a Suite'}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-neutral-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-neutral-500">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>Dates:</span>
                </span>
                <span className="font-bold text-neutral-900">{checkIn} to {checkOut}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  <span>Duration:</span>
                </span>
                <span className="font-bold text-neutral-900">{nights} Night{nights > 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-neutral-500">
                  <Users className="w-3.5 h-3.5 text-gold-500" />
                  <span>Guests:</span>
                </span>
                <span className="font-bold text-neutral-900">{adults} Adults, {children} Kids</span>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Room Total:</span>
                <span className="font-semibold text-neutral-900">Rs. {roomTotal.toLocaleString()}</span>
              </div>

              {addonsTotal > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Meal Add-ons & Extras:</span>
                  <span className="font-semibold text-neutral-900">Rs. {addonsTotal.toLocaleString()}</span>
                </div>
              )}

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>- Rs. {discountTotal.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-neutral-900">Grand Total:</span>
                <span className="font-serif text-2xl font-bold text-gold-600">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>

              {currentPhase >= 4 && (
                <div className="p-3 bg-neutral-50 rounded-xl space-y-1 text-[11px] text-neutral-600 mt-2">
                  <div className="flex justify-between">
                    <span>Payable Now:</span>
                    <span className="font-bold text-neutral-900">Rs. {payableNow.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due at Check-in:</span>
                    <span className="font-bold text-neutral-900">Rs. {dueAtCheckin.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 leading-snug space-y-1">
              <p className="flex items-center space-x-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Free cancellation up to 24h prior</span>
              </p>
              <p>• Location: Opposite City Bus Terminal, Bund Road</p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Phase 1 Instant Proceed (Mobile & Desktop) */}
      {currentPhase === 1 && selectedRoom && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-700/80 px-4 py-3 shadow-2xl no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">
                Selected Room Suite
              </span>
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {selectedRoom.name} <span className="text-neutral-400 font-normal">({nights}nt • Rs. {(selectedRoom.base_price * nights).toLocaleString()})</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentPhase(2);
              }}
              className="bg-gold-500 hover:bg-gold-600 active:scale-95 text-neutral-950 font-bold px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg shrink-0 transition-all"
            >
              <span>Proceed to Meal Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Room Details & YouTube Walkthrough Modal */}
      {modalRoom && (
        <RoomDetailsModal
          room={modalRoom}
          onClose={() => setModalRoom(null)}
          onSelectAndProceed={(r) => {
            setSelectedRoom(r);
            setModalRoom(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setCurrentPhase(2);
          }}
        />
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-36 text-center text-sm font-semibold text-neutral-500">Loading Reservation Engine...</div>}>
      <BookingEngineContent />
    </Suspense>
  );
}
