"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  LayoutDashboard, 
  CalendarCheck, 
  BedDouble, 
  Building, 
  UtensilsCrossed, 
  Sliders, 
  Image as ImageIcon, 
  Tag, 
  Settings, 
  Mail, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Printer, 
  X, 
  ChevronRight,
  Eye,
  RefreshCw,
  Building2,
  Video,
  Film,
  Wrench
} from 'lucide-react';
import InvoiceSlip from '@/components/InvoiceSlip';
import { 
  getAdminBookings, 
  updateBookingStatus, 
  updateBookingDetails,
  deleteBooking,
  deleteAllBookings,
  getAllAdminRoomCategories, 
  saveRoomCategory, 
  deleteRoomCategory, 
  getPhysicalRooms, 
  savePhysicalRoom, 
  deletePhysicalRoom, 
  getAllAdminMealAddons, 
  saveMealAddon, 
  deleteMealAddon, 
  getAllAdminHeroBanners, 
  saveHeroBanner, 
  deleteHeroBanner, 
  getGalleryItems, 
  saveGalleryItem, 
  deleteGalleryItem, 
  getAllPromoCodes, 
  savePromoCode, 
  deletePromoCode, 
  getHotelSettings, 
  updateHotelSettings, 
  getContactMessages,
  uploadMediaFile
} from '@/lib/db';
import type { 
  Booking, 
  RoomCategory, 
  PhysicalRoom, 
  MealAddon, 
  HeroBanner, 
  GalleryItem, 
  PromoCode, 
  HotelSettings, 
  ContactMessage 
} from '@/lib/types';
import CustomModal from '@/components/CustomModal';

export default function AdminPortalPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'rooms' | 'inventory' | 'meals' | 'banners' | 'gallery' | 'promos' | 'settings' | 'messages'>('dashboard');

  // Shared Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [physicalRooms, setPhysicalRooms] = useState<PhysicalRoom[]>([]);
  const [meals, setMeals] = useState<MealAddon[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals & Action States
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Edit Items for Modals
  const [editRoom, setEditRoom] = useState<Partial<RoomCategory> | null>(null);
  const [editMeal, setEditMeal] = useState<Partial<MealAddon> | null>(null);
  const [editBanner, setEditBanner] = useState<Partial<HeroBanner> | null>(null);
  const [editPromo, setEditPromo] = useState<Partial<PromoCode> | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [printBooking, setPrintBooking] = useState<Booking | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check Session Auth on Mount
  useEffect(() => {
    const saved = sessionStorage.getItem('ntp_admin_auth');
    if (saved === 'verified') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'newtajpalace_@#123') {
      sessionStorage.setItem('ntp_admin_auth', 'verified');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid administrator master password. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ntp_admin_auth');
    setIsAuthenticated(false);
  };

  // Load Admin Data
  const reloadData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [bData, rData, prData, mData, bnData, gData, pData, sData, msgData] = await Promise.all([
        getAdminBookings(),
        getAllAdminRoomCategories(),
        getPhysicalRooms(),
        getAllAdminMealAddons(),
        getAllAdminHeroBanners(),
        getGalleryItems(),
        getAllPromoCodes(),
        getHotelSettings(),
        getContactMessages()
      ]);
      setBookings(bData);
      setRooms(rData);
      setPhysicalRooms(prData);
      setMeals(mData);
      setBanners(bnData);
      setGallery(gData);
      setPromos(pData);
      setSettings(sData);
      setMessages(msgData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadData();
    }
  }, [isAuthenticated]);

  // Handle Image Upload with Automatic WebP Compression
  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    setUploadingImage(true);
    try {
      const cdnUrl = await uploadMediaFile(file, 'hotel');
      callback(cdnUrl);
      showToast('Image compressed to WebP and uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      showToast('Image upload failed. Please try another image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Multiple Gallery Images Upload (All compressed to WebP under 80KB)
  const handleMultipleFileUpload = async (files: FileList | File[], callback: (urls: string[]) => void) => {
    setUploadingImage(true);
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(f => uploadMediaFile(f, 'hotel-suites'));
      const uploadedUrls = await Promise.all(uploadPromises);
      callback(uploadedUrls);
      showToast(`${uploadedUrls.length} images compressed to WebP and added!`);
    } catch (err) {
      console.error('Multiple upload failed:', err);
      showToast('Some images failed to upload. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================================================
  // 1. PIN / PASSWORD AUTHENTICATION SCREEN
  // =========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              NEW TAJ PALACE HOTEL
            </h1>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mt-1">
              Management Control Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-master-password" className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Master PIN / Security Key
              </label>
              <input
                id="admin-master-password"
                type="password"
                required
                autoFocus
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-gold-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all font-mono"
              />
            </div>

            {authError && (
              <p className="text-xs font-semibold text-red-400">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-neutral-950 font-bold py-3 rounded-xl text-sm shadow-md active:scale-95 transition-all"
            >
              Authorize & Enter Portal
            </button>
          </form>

          <p className="text-[11px] text-neutral-500">
            Authorized management access only. All sessions and mutations are monitored.
          </p>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalBookingsCount = bookings.length;
  const pendingReviewCount = bookings.filter(b => b.booking_status === 'pending_review').length;
  const confirmedCount = bookings.filter(b => b.booking_status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.booking_status === 'confirmed' || b.booking_status === 'checked_in' || b.booking_status === 'checked_out')
    .reduce((acc, curr) => acc + (Number(curr.grand_total) || 0), 0);

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.booking_status !== bookingFilter) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const matchName = b.guest_name.toLowerCase().includes(q);
      const matchRef = b.reference.toLowerCase().includes(q);
      const matchPhone = b.guest_phone.includes(q);
      if (!matchName && !matchRef && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gold-500 text-neutral-950 font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs sm:text-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal (Zero localhost says alert!) */}
      <CustomModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        type="danger"
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        onConfirm={deleteModal.onConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
      />

      {/* ========================================================= */}
      {/* Dedicated Admin Sidebar (Zero public header/footer) */}
      {/* ========================================================= */}
      <aside className="w-full lg:w-64 bg-neutral-900 border-r border-neutral-800 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3 pb-6 border-b border-neutral-800">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h2 className="font-serif font-bold text-white text-base leading-tight">NEW TAJ PALACE</h2>
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest block">Admin Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'bookings', label: `Reservations (${pendingReviewCount > 0 ? `+${pendingReviewCount}` : bookings.length})`, icon: CalendarCheck, badge: pendingReviewCount },
              { id: 'rooms', label: `Room Suites (${rooms.length})`, icon: BedDouble },
              { id: 'inventory', label: `Physical Rooms (${physicalRooms.length})`, icon: Building },
              { id: 'meals', label: 'Meal Add-ons & Extras', icon: UtensilsCrossed },
              { id: 'banners', label: 'Hero Banners', icon: Sliders },
              { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
              { id: 'promos', label: 'Promo Vouchers', icon: Tag },
              { id: 'settings', label: 'Hotel & Bank Settings', icon: Settings },
              { id: 'messages', label: `Inquiries (${messages.length})`, icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gold-500 text-neutral-950 font-bold shadow-md shadow-gold-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center space-x-2 text-xs font-bold text-neutral-400 hover:text-gold-400 px-3 py-2 rounded-xl hover:bg-neutral-800/40 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-xs font-bold text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* Main Admin Workspace Area */}
      {/* ========================================================= */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block mb-1">
              New Taj Palace Hotel • Management Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white capitalize">
              {activeTab === 'dashboard' ? 'Operational Dashboard' : `${activeTab} Management`}
            </h1>
          </div>

          <button
            onClick={reloadData}
            disabled={loading}
            className="self-start sm:self-auto inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Cloud DB</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OPERATIONAL DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Bookings</span>
                <span className="font-serif text-3xl font-bold text-white block">{totalBookingsCount}</span>
                <span className="text-[11px] text-neutral-500">All recorded stay requests</span>
              </div>

              <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-2 bg-amber-500/5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Pending Review</span>
                <span className="font-serif text-3xl font-bold text-amber-300 block">{pendingReviewCount}</span>
                <span className="text-[11px] text-amber-400/80">Requires approval/rejection</span>
              </div>

              <div className="bg-neutral-900 border border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-2 bg-emerald-500/5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Confirmed Stays</span>
                <span className="font-serif text-3xl font-bold text-emerald-300 block">{confirmedCount}</span>
                <span className="text-[11px] text-emerald-400/80">Active confirmed guests</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Recorded Revenue</span>
                <span className="font-serif text-2xl font-bold text-gold-400 block">
                  Rs. {totalRevenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-neutral-500">Confirmed booking value</span>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Management Action Shortcuts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-gold-500 text-left transition-colors"
                >
                  <CalendarCheck className="w-6 h-6 text-gold-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Review New Bookings</h4>
                  <p className="text-xs text-neutral-400 mt-1">Check pending guest dates and payments</p>
                </button>

                <button
                  onClick={() => {
                    setEditRoom({
                      name: '',
                      slug: '',
                      base_price: 5000,
                      max_adults: 2,
                      max_children: 1,
                      bed_type: 'King Bed',
                      room_size: '320 sq ft',
                      short_desc: '',
                      description: '',
                      amenities: ['Free Wi-Fi', 'Inverter AC', 'Private Bath'],
                      is_active: true
                    });
                    setActiveTab('rooms');
                  }}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-gold-500 text-left transition-colors"
                >
                  <Plus className="w-6 h-6 text-gold-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Add New Room Suite</h4>
                  <p className="text-xs text-neutral-400 mt-1">Upload photos & set rates</p>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-gold-500 text-left transition-colors"
                >
                  <Settings className="w-6 h-6 text-gold-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">Hotel & Bank Accounts</h4>
                  <p className="text-xs text-neutral-400 mt-1">Update phone, WhatsApp & bank details</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RESERVATIONS / BOOKINGS MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter & Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by Guest Name, Reference, Phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500 w-64 sm:w-80"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-400 font-semibold">Status:</span>
                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {bookings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        title: 'Delete All Reservations',
                        message: 'Are you sure you want to permanently delete ALL reservations? This will clear all booking records directly from the database and cannot be undone.',
                        onConfirm: async () => {
                          try {
                            await deleteAllBookings();
                            showToast('All reservations have been cleared from database');
                            setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                            reloadData();
                          } catch (delAllErr) {
                            console.error('Error clearing bookings:', delAllErr);
                            showToast('Failed to delete all bookings. Please try again.');
                          }
                        }
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all"
                    title="Delete All Reservations"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="py-16 text-center bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
                  <p className="text-sm text-neutral-400">No reservations found matching current criteria.</p>
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-bold text-gold-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                          {b.reference}
                        </span>
                        <span className="font-bold text-white text-base">{b.guest_name}</span>
                        <span className="text-xs text-neutral-400">• {b.guest_phone}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Status Selectors */}
                        <select
                          value={b.booking_status}
                          onChange={async (e) => {
                            const newSt = e.target.value as Booking['booking_status'];
                            await updateBookingStatus(b.id, newSt);
                            showToast(`Booking ${b.reference} status updated to ${newSt}`);
                            reloadData();
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                            b.booking_status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            b.booking_status === 'pending_review' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                            b.booking_status === 'cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}
                        >
                          <option value="pending_review">Pending Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="checked_out">Checked Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Payment Status */}
                        <select
                          value={b.payment_status}
                          onChange={async (e) => {
                            const newPay = e.target.value as Booking['payment_status'];
                            await updateBookingStatus(b.id, b.booking_status, newPay);
                            showToast(`Payment status updated to ${newPay}`);
                            reloadData();
                          }}
                          className="text-xs bg-neutral-950 border border-neutral-700 text-neutral-300 font-semibold px-2.5 py-1.5 rounded-xl"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="under_review">Proof Under Review</option>
                          <option value="verified">Verified / Paid</option>
                          <option value="rejected">Payment Rejected</option>
                        </select>

                        {/* Edit Reservation Details (Prices, Extras, Notes) */}
                        <button
                          type="button"
                          onClick={() => setEditingBooking(b)}
                          className="p-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-gold-400 hover:bg-neutral-700 transition-all"
                          title="Edit Reservation & Invoice Charges"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Print Official Invoice Slip */}
                        <button
                          type="button"
                          onClick={() => setPrintBooking(b)}
                          className="p-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-all"
                          title="Print Official Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Delete Single Reservation */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteModal({
                              isOpen: true,
                              title: 'Delete Reservation',
                              message: `Are you sure you want to permanently delete reservation ${b.reference} for ${b.guest_name}? This action will remove the record directly from the database and cannot be undone.`,
                              onConfirm: async () => {
                                try {
                                  await deleteBooking(b.id, b.reference);
                                  showToast(`Reservation ${b.reference} deleted successfully`);
                                  setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                                  reloadData();
                                } catch (delErr) {
                                  console.error('Failed to delete booking:', delErr);
                                  showToast('Failed to delete reservation. Please try again.');
                                }
                              }
                            });
                          }}
                          className="p-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-neutral-400">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-500">Suite</span>
                        <span className="font-semibold text-neutral-200">{b.room_category_name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-500">Dates</span>
                        <span className="font-semibold text-neutral-200">{b.check_in} to {b.check_out} ({b.nights}nt)</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-500">Payment</span>
                        <span className="font-semibold text-neutral-200 uppercase">{b.payment_method.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-500">Grand Total</span>
                        <span className="font-serif font-bold text-gold-400 text-sm">Rs. {b.grand_total.toLocaleString()}</span>
                      </div>
                    </div>

                    {b.special_requests && (
                      <div className="p-3 bg-neutral-950 rounded-xl text-xs text-neutral-300 border border-neutral-800">
                        <span className="text-neutral-500 font-bold block mb-0.5">Guest Request:</span>
                        {b.special_requests}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ROOM CATEGORIES MANAGER (CRUD + Direct WebP Upload) */}
        {/* ========================================================= */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">Manage all room types, descriptions, base prices, gallery photos, and walkthrough videos.</span>
              <button
                type="button"
                onClick={() => setEditRoom({
                  name: '',
                  slug: '',
                  base_price: 4500,
                  max_adults: 2,
                  max_children: 1,
                  bed_type: 'King Bed',
                  room_size: '300 sq ft',
                  short_desc: '',
                  description: '',
                  status: 'available',
                  gallery_images: [],
                  video_url: '',
                  amenities: ['Free Wi-Fi', 'Inverter AC', 'Attached Bath'],
                  is_active: true
                })}
                className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Room Suite</span>
              </button>
            </div>

            {/* Room Suites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const roomStatus = room.status || 'available';
                const galleryCount = (Array.isArray(room.gallery_images) ? room.gallery_images.length : 0);
                return (
                  <div
                    key={room.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-black">
                        <img 
                          src={room.featured_image || '/images/rooms/room-2.webp'} 
                          alt={room.name} 
                          className="w-full h-full object-cover" 
                        />
                        {/* Price Tag */}
                        <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gold-400 shadow-sm">
                          Rs. {room.base_price.toLocaleString()} / nt
                        </div>

                        {/* Availability Status Badge */}
                        <div className="absolute top-2 left-2">
                          {roomStatus === 'available' && (
                            <span className="inline-flex items-center space-x-1 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Available</span>
                            </span>
                          )}
                          {roomStatus === 'occupied' && (
                            <span className="inline-flex items-center space-x-1 bg-amber-950/90 border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              <span>Occupied</span>
                            </span>
                          )}
                          {roomStatus === 'maintenance' && (
                            <span className="inline-flex items-center space-x-1 bg-neutral-900/90 border border-neutral-600 text-neutral-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                              <Wrench className="w-3 h-3 text-neutral-400" />
                              <span>Maintenance</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Media Indicators */}
                        <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 text-[10px] font-bold text-white">
                          <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3 text-gold-400" />
                            <span>{galleryCount + 1} Photos</span>
                          </span>
                          {room.video_url && (
                            <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center space-x-1 text-red-400">
                              <Video className="w-3 h-3 text-red-400" />
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-white">{room.name}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{room.short_desc}</p>
                      
                      <div className="text-xs text-neutral-400 mt-2 flex items-center space-x-2">
                        <span>Max {room.max_adults} Adults</span>
                        <span className="text-neutral-600">•</span>
                        <span>{room.bed_type}</span>
                        {room.room_size && (
                          <>
                            <span className="text-neutral-600">•</span>
                            <span>{room.room_size}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setEditRoom({
                          ...room,
                          status: room.status || 'available',
                          gallery_images: Array.isArray(room.gallery_images) ? room.gallery_images : [],
                          video_url: room.video_url || ''
                        })}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gold-400" />
                        <span>Edit Suite</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteModal({
                            isOpen: true,
                            title: 'Delete Room Suite',
                            message: `Are you sure you want to permanently delete "${room.name}"? This action cannot be undone.`,
                            onConfirm: async () => {
                              await deleteRoomCategory(room.id);
                              showToast(`Deleted ${room.name}`);
                              setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                              reloadData();
                            }
                          });
                        }}
                        className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Suite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Room Suite Edit / Add Modal */}
            {editRoom && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                  {/* Sticky Modal Header */}
                  <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 shrink-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">Suite Management</span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                        {editRoom.id ? `Edit: ${editRoom.name || 'Room Suite'}` : 'Create New Room Suite'}
                      </h3>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEditRoom(null)} 
                      className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Modal Body */}
                  <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
                    {/* 1. Availability Status Selector */}
                    <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                      <label className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
                        Suite Availability Status
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                          (editRoom.status || 'available') === 'available'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="room_status"
                            value="available"
                            checked={(editRoom.status || 'available') === 'available'}
                            onChange={() => setEditRoom({ ...editRoom, status: 'available' })}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="text-xs font-bold block text-emerald-400">Available</span>
                            <span className="text-[10px] text-neutral-400 block">Instant online booking active</span>
                          </div>
                        </label>

                        <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                          editRoom.status === 'occupied'
                            ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="room_status"
                            value="occupied"
                            checked={editRoom.status === 'occupied'}
                            onChange={() => setEditRoom({ ...editRoom, status: 'occupied' })}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                          <div>
                            <span className="text-xs font-bold block text-amber-400">Occupied</span>
                            <span className="text-[10px] text-neutral-400 block">Shows WhatsApp inquiry CTA</span>
                          </div>
                        </label>

                        <label className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                          editRoom.status === 'maintenance'
                            ? 'bg-neutral-800/80 border-neutral-500 text-white shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="room_status"
                            value="maintenance"
                            checked={editRoom.status === 'maintenance'}
                            onChange={() => setEditRoom({ ...editRoom, status: 'maintenance' })}
                            className="text-neutral-400 focus:ring-neutral-400"
                          />
                          <div>
                            <span className="text-xs font-bold block text-neutral-300">Maintenance</span>
                            <span className="text-[10px] text-neutral-400 block">Under cleaning / renovation</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 2. Featured Image & Multiple Gallery Upload */}
                    <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1">
                          Featured Cover Photograph (Direct WebP Upload)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => setEditRoom(prev => ({ ...prev!, featured_image: url })));
                              }
                            }}
                            className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-neutral-950 hover:file:bg-gold-400 cursor-pointer"
                          />
                          {uploadingImage && <span className="text-xs text-gold-400 font-bold animate-pulse">Compressing WebP & uploading...</span>}
                        </div>
                        {editRoom.featured_image && (
                          <div className="mt-2.5 h-28 w-44 rounded-xl overflow-hidden border border-neutral-700 relative">
                            <img src={editRoom.featured_image} alt="Featured Cover" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] font-bold text-gold-400 px-1.5 py-0.5 rounded">
                              Cover Photo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Multiple Gallery Photos Upload */}
                      <div className="pt-3 border-t border-neutral-800/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                            Additional Gallery Photos ({Array.isArray(editRoom.gallery_images) ? editRoom.gallery_images.length : 0} uploaded)
                          </label>
                          <span className="text-[11px] text-neutral-500">Auto-compressed to WebP (&lt;80KB)</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              handleMultipleFileUpload(files, (newUrls) => {
                                setEditRoom(prev => ({
                                  ...prev!,
                                  gallery_images: [...(Array.isArray(prev?.gallery_images) ? prev.gallery_images : []), ...newUrls]
                                }));
                              });
                            }
                          }}
                          className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-800 file:text-gold-400 hover:file:bg-neutral-700 cursor-pointer"
                        />

                        {/* Gallery Thumbnails with Delete Action */}
                        {Array.isArray(editRoom.gallery_images) && editRoom.gallery_images.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                            {editRoom.gallery_images.map((imgUrl, idx) => (
                              <div key={idx} className="relative group h-20 rounded-xl overflow-hidden border border-neutral-700 bg-black">
                                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = (editRoom.gallery_images || []).filter((_, i) => i !== idx);
                                    setEditRoom({ ...editRoom, gallery_images: filtered });
                                    showToast('Photo removed from gallery');
                                  }}
                                  className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-md opacity-80 hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. YouTube Video Walkthrough URL */}
                    <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-red-500" />
                        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                          YouTube Video Walkthrough URL
                        </label>
                      </div>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        value={editRoom.video_url || ''}
                        onChange={(e) => setEditRoom({ ...editRoom, video_url: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:border-gold-500 focus:outline-none"
                      />
                      <p className="text-[11px] text-neutral-400 leading-tight">
                        Guests can play this video directly inside the interactive Room Details popup on the website without leaving the page.
                      </p>
                    </div>

                    {/* 4. Suite Name & URL Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Suite Name</label>
                        <input
                          type="text"
                          value={editRoom.name || ''}
                          onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value, slug: editRoom.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={editRoom.slug || ''}
                          onChange={(e) => setEditRoom({ ...editRoom, slug: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* 5. Pricing, Capacity & Specs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Base Rate (Rs.)</label>
                        <input
                          type="number"
                          value={editRoom.base_price || 0}
                          onChange={(e) => setEditRoom({ ...editRoom, base_price: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-gold-400 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Max Adults</label>
                        <input
                          type="number"
                          value={editRoom.max_adults || 2}
                          onChange={(e) => setEditRoom({ ...editRoom, max_adults: Number(e.target.value) })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Bed Configuration</label>
                        <input
                          type="text"
                          value={editRoom.bed_type || 'King Bed'}
                          onChange={(e) => setEditRoom({ ...editRoom, bed_type: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Room Dimensions</label>
                        <input
                          type="text"
                          value={editRoom.room_size || '320 sq ft'}
                          onChange={(e) => setEditRoom({ ...editRoom, room_size: e.target.value })}
                          placeholder="e.g. 320 sq ft"
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* 6. Descriptions */}
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Short Summary (Cards & List)</label>
                      <input
                        type="text"
                        value={editRoom.short_desc || ''}
                        onChange={(e) => setEditRoom({ ...editRoom, short_desc: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Detailed Description (Popup Modal)</label>
                      <textarea
                        rows={3}
                        value={editRoom.description || ''}
                        onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Sticky Modal Footer */}
                  <div className="p-4 sm:p-5 border-t border-neutral-800 flex items-center justify-end space-x-3 bg-neutral-900 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditRoom(null)}
                      className="px-5 py-2.5 rounded-xl border border-neutral-700 text-xs font-bold text-neutral-300 hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={async () => {
                        try {
                          await saveRoomCategory(editRoom);
                          showToast('Room suite saved to cloud database!');
                          setEditRoom(null);
                          reloadData();
                        } catch (err) {
                          console.error('Failed to save room suite:', err);
                          showToast('Failed to save room suite. Please check fields.');
                        }
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold text-xs shadow-md active:scale-95 transition-all"
                    >
                      Save Room Suite
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PHYSICAL ROOMS INVENTORY */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <span className="text-xs text-neutral-400 block">
              Manage physical room numbers, floor allocation, and availability status (available, occupied, maintenance).
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {physicalRooms.map((pr) => (
                <div
                  key={pr.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center space-y-2 shadow-sm"
                >
                  <span className="font-mono text-xl font-bold text-white block">#{pr.room_number}</span>
                  <span className="text-[11px] text-neutral-400 block">{pr.floor}</span>

                  <select
                    value={pr.status}
                    onChange={async (e) => {
                      const nextSt = e.target.value as PhysicalRoom['status'];
                      await savePhysicalRoom({ id: pr.id, status: nextSt });
                      showToast(`Room #${pr.room_number} status set to ${nextSt}`);
                      reloadData();
                    }}
                    className={`w-full text-[10px] font-bold py-1 px-1.5 rounded-lg border focus:outline-none ${
                      pr.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      pr.status === 'occupied' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MEAL ADD-ONS & EXTRA SERVICES */}
        {/* ========================================================= */}
        {activeTab === 'meals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">Configure meals and extra add-ons available during booking.</span>
              <button
                onClick={() => setEditMeal({ name: '', code: '', price_adult: 500, price_child: 300, is_active: true })}
                className="bg-gold-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Extra Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map((m) => (
                <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{m.description}</p>
                    <span className="text-xs font-semibold text-gold-400 mt-1 block">
                      Adult: Rs. {m.price_adult.toLocaleString()} • Child: Rs. {m.price_child.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditMeal(m)}
                      className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5 text-gold-400" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal({
                          isOpen: true,
                          title: 'Delete Meal Add-on',
                          message: `Are you sure you want to remove "${m.name}"?`,
                          onConfirm: async () => {
                            await deleteMealAddon(m.id);
                            showToast(`Deleted ${m.name}`);
                            setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                            reloadData();
                          }
                        });
                      }}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Edit Modal */}
            {editMeal && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                    <h3 className="font-serif font-bold text-white text-base">Edit Extra Service</h3>
                    <button onClick={() => setEditMeal(null)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Service Name</label>
                    <input
                      type="text"
                      value={editMeal.name || ''}
                      onChange={(e) => setEditMeal({ ...editMeal, name: e.target.value, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]+/g, '_') })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Adult Price (Rs.)</label>
                      <input
                        type="number"
                        value={editMeal.price_adult || 0}
                        onChange={(e) => setEditMeal({ ...editMeal, price_adult: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Child Price (Rs.)</label>
                      <input
                        type="number"
                        value={editMeal.price_child || 0}
                        onChange={(e) => setEditMeal({ ...editMeal, price_child: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Description</label>
                    <input
                      type="text"
                      value={editMeal.description || ''}
                      onChange={(e) => setEditMeal({ ...editMeal, description: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="pt-2 flex justify-end space-x-2">
                    <button onClick={() => setEditMeal(null)} className="px-4 py-2 border border-neutral-700 rounded-xl text-xs font-bold">Cancel</button>
                    <button
                      onClick={async () => {
                        await saveMealAddon(editMeal);
                        showToast('Meal service saved!');
                        setEditMeal(null);
                        reloadData();
                      }}
                      className="px-5 py-2 bg-gold-500 text-neutral-950 font-bold rounded-xl text-xs"
                    >
                      Save Service
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: HERO BANNERS MANAGER (Direct WebP Upload) */}
        {/* ========================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">Manage promotional sliders displayed on the homepage.</span>
              <button
                onClick={() => setEditBanner({ title: '', subtitle: '', image_url: '', cta_text: 'Book Now', cta_link: '/book', is_active: true })}
                className="bg-gold-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative h-44 bg-black">
                    <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-white text-base">{b.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2">{b.subtitle}</p>
                    <div className="pt-2 flex justify-between items-center border-t border-neutral-800">
                      <span className="text-[11px] text-gold-400 font-semibold">{b.cta_text} ➔ {b.cta_link}</span>
                      <button
                        onClick={() => {
                          setDeleteModal({
                            isOpen: true,
                            title: 'Delete Hero Banner',
                            message: `Are you sure you want to remove banner "${b.title}"?`,
                            onConfirm: async () => {
                              await deleteHeroBanner(b.id);
                              showToast('Banner removed');
                              setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                              reloadData();
                            }
                          });
                        }}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner Edit Modal with Direct WebP Upload */}
            {editBanner && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                    <h3 className="font-serif font-bold text-white text-base">Add / Edit Banner</h3>
                    <button onClick={() => setEditBanner(null)} className="text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">
                      Banner Photograph (Direct WebP Upload)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setEditBanner(prev => ({ ...prev!, image_url: url })));
                      }}
                      className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-neutral-950 cursor-pointer"
                    />
                    {editBanner.image_url && (
                      <div className="mt-2 h-20 w-36 rounded-xl overflow-hidden border border-neutral-700">
                        <img src={editBanner.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Headline Title</label>
                    <input
                      type="text"
                      value={editBanner.title || ''}
                      onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Supporting Subtitle</label>
                    <input
                      type="text"
                      value={editBanner.subtitle || ''}
                      onChange={(e) => setEditBanner({ ...editBanner, subtitle: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button onClick={() => setEditBanner(null)} className="px-4 py-2 border border-neutral-700 rounded-xl text-xs font-bold">Cancel</button>
                    <button
                      onClick={async () => {
                        await saveHeroBanner(editBanner);
                        showToast('Banner saved!');
                        setEditBanner(null);
                        reloadData();
                      }}
                      className="px-5 py-2 bg-gold-500 text-neutral-950 font-bold rounded-xl text-xs"
                    >
                      Save Banner
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PHOTO GALLERY MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">Upload New Hotel Photo</h4>
                <p className="text-xs text-neutral-400">Files are automatically compressed to high-efficiency WebP format in browser.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file, async (url) => {
                      await saveGalleryItem({ image_url: url, category: 'Rooms', title: 'New Room Photograph' });
                      reloadData();
                    });
                  }
                }}
                className="text-xs text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-neutral-950 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="relative h-44 rounded-2xl overflow-hidden group bg-black border border-neutral-800">
                  <img src={item.image_url} alt="Gallery" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => {
                        setDeleteModal({
                          isOpen: true,
                          title: 'Delete Photo',
                          message: 'Remove this photograph from public gallery?',
                          onConfirm: async () => {
                            await deleteGalleryItem(item.id);
                            showToast('Photo removed from gallery');
                            setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                            reloadData();
                          }
                        });
                      }}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: PROMO CODES / VOUCHERS */}
        {/* ========================================================= */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">Create promotional discount codes for guests.</span>
              <button
                onClick={() => setEditPromo({ code: '', discount_type: 'percentage', discount_value: 10, min_spend: 3000, is_active: true })}
                className="bg-gold-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promos.map((p) => (
                <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
                  <span className="font-mono text-base font-bold text-gold-400 tracking-wider block">{p.code}</span>
                  <p className="text-xs text-neutral-300">
                    {p.discount_type === 'percentage' ? `${p.discount_value}% Off` : `Rs. ${p.discount_value} Flat Off`}
                  </p>
                  <p className="text-[11px] text-neutral-500">Min Spend: Rs. {p.min_spend.toLocaleString()}</p>
                  <button
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        title: 'Delete Promo Code',
                        message: `Permanently delete promo code "${p.code}"?`,
                        onConfirm: async () => {
                          await deletePromoCode(p.id);
                          showToast(`Deleted ${p.code}`);
                          setDeleteModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
                          reloadData();
                        }
                      });
                    }}
                    className="text-xs text-red-400 hover:underline pt-2 block"
                  >
                    Remove Code
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Edit Modal */}
            {editPromo && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-sm w-full space-y-4">
                  <h3 className="font-serif font-bold text-white text-base">New Promo Code</h3>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 block mb-1">Promo Code (Uppercase)</label>
                    <input
                      type="text"
                      placeholder="e.g. TAJ20"
                      value={editPromo.code || ''}
                      onChange={(e) => setEditPromo({ ...editPromo, code: e.target.value.toUpperCase() })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white uppercase font-mono font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-400 block mb-1">Type</label>
                      <select
                        value={editPromo.discount_type || 'percentage'}
                        onChange={(e) => setEditPromo({ ...editPromo, discount_type: e.target.value as 'percentage' | 'fixed' })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (Rs.)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-400 block mb-1">Value</label>
                      <input
                        type="number"
                        value={editPromo.discount_value || 10}
                        onChange={(e) => setEditPromo({ ...editPromo, discount_value: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 block mb-1">Minimum Spend (Rs.)</label>
                    <input
                      type="number"
                      value={editPromo.min_spend || 0}
                      onChange={(e) => setEditPromo({ ...editPromo, min_spend: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="pt-2 flex justify-end space-x-2">
                    <button onClick={() => setEditPromo(null)} className="px-4 py-2 border border-neutral-700 rounded-xl text-xs font-bold">Cancel</button>
                    <button
                      onClick={async () => {
                        await savePromoCode(editPromo);
                        showToast('Promo code saved!');
                        setEditPromo(null);
                        reloadData();
                      }}
                      className="px-5 py-2 bg-gold-500 text-neutral-950 font-bold rounded-xl text-xs"
                    >
                      Save Code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: HOTEL & BANK SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && settings && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-6 max-w-4xl">
            <h3 className="font-serif text-xl font-bold text-white pb-3 border-b border-neutral-800">
              Hotel Business Identity & Bank Account Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Hotel Business Name</label>
                <input
                  type="text"
                  value={settings.hotel_name}
                  onChange={(e) => setSettings({ ...settings, hotel_name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Phone Helpline</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">WhatsApp Number (e.g. 923224845461)</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Official Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            {/* Bank Accounts Section */}
            <div className="pt-6 border-t border-neutral-800 space-y-6">
              <div>
                <h4 className="font-bold text-gold-400 text-sm uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gold-400" />
                  <span>1. Official Bank Account Details</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">Customers transferring funds via banking apps will send to this account.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={settings.bank_name || ''}
                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                    placeholder="e.g. Meezan Bank"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Bank Account Title</label>
                  <input
                    type="text"
                    value={settings.bank_account_title || ''}
                    onChange={(e) => setSettings({ ...settings, bank_account_title: e.target.value })}
                    placeholder="e.g. New Taj Palace Hotel"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={settings.bank_account_number || ''}
                    onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                    placeholder="e.g. 02010108492019"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">IBAN Number</label>
                  <input
                    type="text"
                    value={settings.bank_iban || ''}
                    onChange={(e) => setSettings({ ...settings, bank_iban: e.target.value })}
                    placeholder="e.g. PK45MEZN0002010108492019"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-gold-500"
                  />
                </div>
              </div>

              {/* JazzCash Section */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-4">
                <div>
                  <h4 className="font-bold text-red-500 text-sm uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                    <span>2. JazzCash Mobile Wallet Account</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Separate title and mobile account number displayed on checkout and invoice slips.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">JazzCash Account Title</label>
                    <input
                      type="text"
                      value={settings.jazzcash_title || ''}
                      onChange={(e) => setSettings({ ...settings, jazzcash_title: e.target.value })}
                      placeholder="e.g. New Taj Palace Hotel / Owner Name"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">JazzCash Mobile / Account Number</label>
                    <input
                      type="text"
                      value={settings.jazzcash_number || ''}
                      onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                      placeholder="e.g. 03224845461"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-red-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* EasyPaisa Section */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-4">
                <div>
                  <h4 className="font-bold text-emerald-500 text-sm uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>3. EasyPaisa Mobile Wallet Account</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Separate title and mobile account number for EasyPaisa direct transfers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">EasyPaisa Account Title</label>
                    <input
                      type="text"
                      value={settings.easypaisa_title || ''}
                      onChange={(e) => setSettings({ ...settings, easypaisa_title: e.target.value })}
                      placeholder="e.g. New Taj Palace Hotel / Owner Name"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase block mb-1">EasyPaisa Mobile / Account Number</label>
                    <input
                      type="text"
                      value={settings.easypaisa_number || ''}
                      onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                      placeholder="e.g. 03224845461"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  await updateHotelSettings(settings);
                  showToast('Hotel settings and bank configurations saved!');
                }}
                className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-8 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
              >
                Save All Hotel Settings
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: GUEST INQUIRIES & MESSAGES */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <span className="text-xs text-neutral-400 block">Messages submitted from the website Contact page.</span>
            {messages.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900 rounded-3xl border border-neutral-800 p-6">
                <p className="text-sm text-neutral-400">No customer inquiries recorded yet.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-white text-sm">{m.name}</span>
                    <span className="text-xs text-gold-400">{m.phone}</span>
                  </div>
                  {m.subject && <p className="text-xs font-semibold text-neutral-300">{m.subject}</p>}
                  <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
        {/* ========================================================= */}
        {/* EDIT RESERVATION & INVOICE DETAILS MODAL */}
        {/* ========================================================= */}
        {editingBooking && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
            <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl overflow-hidden">
              {/* Sticky Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">Edit Reservation & Billing</span>
                  <h3 className="font-serif font-bold text-white text-base sm:text-xl">
                    Booking #{editingBooking.reference}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="text-neutral-400 hover:text-white p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
                {/* 1. Guest Details */}
                <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">1. Guest Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Guest Full Name</label>
                      <input
                        type="text"
                        value={editingBooking.guest_name}
                        onChange={(e) => setEditingBooking({ ...editingBooking, guest_name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={editingBooking.guest_phone}
                        onChange={(e) => setEditingBooking({ ...editingBooking, guest_phone: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editingBooking.guest_email || ''}
                        onChange={(e) => setEditingBooking({ ...editingBooking, guest_email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Stay & Room Suite Details */}
                <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">2. Stay & Room Suite</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Room Category Name</label>
                      <input
                        type="text"
                        value={editingBooking.room_category_name}
                        onChange={(e) => setEditingBooking({ ...editingBooking, room_category_name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Check-In Date</label>
                      <input
                        type="date"
                        value={editingBooking.check_in}
                        onChange={(e) => setEditingBooking({ ...editingBooking, check_in: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Check-Out Date</label>
                      <input
                        type="date"
                        value={editingBooking.check_out}
                        onChange={(e) => setEditingBooking({ ...editingBooking, check_out: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Duration (Nights)</label>
                      <input
                        type="number"
                        min={1}
                        value={editingBooking.nights}
                        onChange={(e) => setEditingBooking({ ...editingBooking, nights: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Adults Count</label>
                      <input
                        type="number"
                        min={1}
                        value={editingBooking.adults}
                        onChange={(e) => setEditingBooking({ ...editingBooking, adults: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Kids Count</label>
                      <input
                        type="number"
                        min={0}
                        value={editingBooking.children}
                        onChange={(e) => setEditingBooking({ ...editingBooking, children: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Payment Method</label>
                      <select
                        value={editingBooking.payment_method}
                        onChange={(e) => setEditingBooking({ ...editingBooking, payment_method: e.target.value as 'pay_at_hotel' | 'bank_transfer' })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      >
                        <option value="pay_at_hotel">Pay at Hotel</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Financial Charges & Price Tuning (Responsive Grid) */}
                <div className="space-y-3.5 bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-gold-500/30">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800">
                    <div>
                      <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">
                        3. Price Adjustment & Invoice Totals
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Customize accommodation rates, apply discounts, or add extra charges.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const computed = Math.max(0, 
                          Number(editingBooking.room_total || 0) + 
                          Number(editingBooking.addons_total || 0) + 
                          Number(editingBooking.extra_charges || 0) - 
                          Number(editingBooking.discount_total || 0)
                        );
                        setEditingBooking({ ...editingBooking, grand_total: computed });
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20 transition-all flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Auto-Calculate Total</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase block mb-1">Room Total (Rs.)</label>
                      <input
                        type="number"
                        value={editingBooking.room_total}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingBooking({
                            ...editingBooking,
                            room_total: val,
                            grand_total: Math.max(0, val + Number(editingBooking.addons_total || 0) + Number(editingBooking.extra_charges || 0) - Number(editingBooking.discount_total || 0))
                          });
                        }}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white font-bold focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                      <label className="text-[11px] font-bold text-neutral-300 uppercase block mb-1">Addons / Meals (Rs.)</label>
                      <input
                        type="number"
                        value={editingBooking.addons_total}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingBooking({
                            ...editingBooking,
                            addons_total: val,
                            grand_total: Math.max(0, Number(editingBooking.room_total || 0) + val + Number(editingBooking.extra_charges || 0) - Number(editingBooking.discount_total || 0))
                          });
                        }}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30">
                      <label className="text-[11px] font-bold text-emerald-400 uppercase block mb-1">+ Extra Charges (Rs.)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={editingBooking.extra_charges || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingBooking({
                            ...editingBooking,
                            extra_charges: val,
                            grand_total: Math.max(0, Number(editingBooking.room_total || 0) + Number(editingBooking.addons_total || 0) + val - Number(editingBooking.discount_total || 0))
                          });
                        }}
                        className="w-full bg-neutral-950 border border-emerald-500/50 rounded-lg p-2.5 text-xs text-emerald-300 font-bold focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-emerald-400/80 mt-1 block">e.g. Extra bed, late checkout</span>
                    </div>

                    <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/30">
                      <label className="text-[11px] font-bold text-rose-400 uppercase block mb-1">- Discount / Deductions (Rs.)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={editingBooking.discount_total || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingBooking({
                            ...editingBooking,
                            discount_total: val,
                            grand_total: Math.max(0, Number(editingBooking.room_total || 0) + Number(editingBooking.addons_total || 0) + Number(editingBooking.extra_charges || 0) - val)
                          });
                        }}
                        className="w-full bg-neutral-950 border border-rose-500/50 rounded-lg p-2.5 text-xs text-rose-300 font-bold focus:border-rose-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-rose-400/80 mt-1 block">Special concession or coupon</span>
                    </div>

                    <div className="bg-gold-500/10 p-3 rounded-xl border-2 border-gold-500/50 sm:col-span-2 lg:col-span-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-black text-gold-400 uppercase tracking-wider block">
                          = Net Grand Total Payable (Rs.)
                        </label>
                        <span className="text-[10px] font-mono text-gold-300">Printed on Slip</span>
                      </div>
                      <input
                        type="number"
                        value={editingBooking.grand_total}
                        onChange={(e) => setEditingBooking({ ...editingBooking, grand_total: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-gold-500 rounded-lg p-2.5 text-sm text-gold-400 font-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Status and Notes */}
                <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">4. Status & Invoice Notes</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Reservation Status</label>
                      <select
                        value={editingBooking.booking_status}
                        onChange={(e) => setEditingBooking({ ...editingBooking, booking_status: e.target.value as Booking['booking_status'] })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      >
                        <option value="pending_review">Pending Review</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="checked_out">Checked Out</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">Payment Status</label>
                      <select
                        value={editingBooking.payment_status}
                        onChange={(e) => setEditingBooking({ ...editingBooking, payment_status: e.target.value as Booking['payment_status'] })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white font-semibold focus:border-gold-500 focus:outline-none"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="under_review">Proof Under Review</option>
                        <option value="verified">Verified / Paid</option>
                        <option value="rejected">Payment Rejected</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        Admin Notes & Remarks (Printed on Official Invoice Slip)
                      </label>
                      <textarea
                        rows={2}
                        value={editingBooking.admin_notes || ''}
                        onChange={(e) => setEditingBooking({ ...editingBooking, admin_notes: e.target.value })}
                        placeholder="e.g. Extra bed requested, early check-in approved, airport transfer booked"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 sm:p-5 border-t border-neutral-800 flex items-center justify-end space-x-3 bg-neutral-900 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-700 text-xs font-bold hover:bg-neutral-800 transition-colors text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateBookingDetails(editingBooking.id, {
                        guest_name: editingBooking.guest_name,
                        guest_phone: editingBooking.guest_phone,
                        guest_email: editingBooking.guest_email,
                        room_category_name: editingBooking.room_category_name,
                        check_in: editingBooking.check_in,
                        check_out: editingBooking.check_out,
                        nights: Number(editingBooking.nights),
                        adults: Number(editingBooking.adults),
                        children: Number(editingBooking.children),
                        room_total: Number(editingBooking.room_total),
                        addons_total: Number(editingBooking.addons_total),
                        extra_charges: Number(editingBooking.extra_charges || 0),
                        discount_total: Number(editingBooking.discount_total || 0),
                        grand_total: Number(editingBooking.grand_total),
                        payment_method: editingBooking.payment_method,
                        payment_status: editingBooking.payment_status,
                        booking_status: editingBooking.booking_status,
                        admin_notes: editingBooking.admin_notes || '',
                      });
                      showToast(`Reservation #${editingBooking.reference} updated successfully!`);
                      setEditingBooking(null);
                      reloadData();
                    } catch (saveErr) {
                      console.error('Failed to update booking:', saveErr);
                      showToast('Failed to save changes. Please try again.');
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-neutral-950 text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Save & Update Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PRINT OFFICIAL INVOICE SLIP MODAL */}
        {/* ========================================================= */}
        {printBooking && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl overflow-hidden p-0">
              <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-900 shrink-0 no-print">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">Print Official Slip</span>
                  <h3 className="font-serif font-bold text-white text-base sm:text-xl">
                    Reservation Voucher #{printBooking.reference}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Slip Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintBooking(null)}
                    className="text-neutral-400 hover:text-white p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The isolated Printable Slip */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-neutral-950 print:p-0 print:bg-white print:overflow-visible">
                <InvoiceSlip booking={printBooking} hotelSettings={settings} />
              </div>

              <div className="p-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 bg-neutral-900 shrink-0 no-print">
                <span className="text-[11px]">Only the official invoice voucher slip will be printed. No dashboard navigation or website background.</span>
                <button
                  type="button"
                  onClick={() => setPrintBooking(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
