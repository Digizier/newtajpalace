import { supabase } from './supabase';
import type { 
  RoomCategory, 
  PhysicalRoom, 
  MealAddon, 
  PromoCode, 
  Booking, 
  PaymentProof, 
  HeroBanner, 
  GalleryItem, 
  HotelSettings, 
  FAQ,
  ContactMessage 
} from './types';

// ==========================================
// 1. CLIENT-SIDE WEBP COMPRESSOR (KBs ONLY)
// ==========================================
export async function compressImageToWebP(file: File, maxDim = 1280, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context could not be created'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas WebP compression failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function uploadMediaFile(file: File, folder = 'uploads'): Promise<string> {
  try {
    // 1. Compress to WebP in browser memory (drops size to 20KB-80KB)
    const compressedBlob = await compressImageToWebP(file);
    const cleanFileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.webp`;

    // 2. Upload binary WebP to Supabase Storage
    const { data, error } = await supabase.storage
      .from('hotel-media')
      .upload(cleanFileName, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // 3. Get clean public CDN URL (no base64 in database!)
    const { data: urlData } = supabase.storage
      .from('hotel-media')
      .getPublicUrl(cleanFileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to process/upload media:', err);
    throw err;
  }
}

// ==========================================
// 2. ROOM CATEGORIES (Selective Projection)
// ==========================================
export async function getRoomCategories(page = 1, limit = 8): Promise<{ data: RoomCategory[]; count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('room_categories')
    .select('id, name, slug, short_desc, description, base_price, max_adults, max_children, bed_type, room_size, featured_image, gallery_images, video_url, status, amenities, is_featured, is_active, display_order', { count: 'exact' })
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching rooms:', error);
    return { data: [], count: 0 };
  }

  return { data: (data as RoomCategory[]) || [], count: count || 0 };
}

export async function getAllAdminRoomCategories(): Promise<RoomCategory[]> {
  const { data, error } = await supabase
    .from('room_categories')
    .select('id, name, slug, short_desc, description, base_price, max_adults, max_children, bed_type, room_size, featured_image, gallery_images, video_url, status, amenities, is_featured, is_active, display_order')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data as RoomCategory[]) || [];
}

export async function getRoomCategoryBySlug(slug: string): Promise<RoomCategory | null> {
  const { data, error } = await supabase
    .from('room_categories')
    .select('id, name, slug, short_desc, description, base_price, max_adults, max_children, bed_type, room_size, featured_image, gallery_images, video_url, status, amenities, is_featured, is_active, display_order')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as RoomCategory;
}

export async function saveRoomCategory(room: Partial<RoomCategory>): Promise<RoomCategory> {
  const payload = {
    ...room,
    gallery_images: Array.isArray(room.gallery_images) ? room.gallery_images : [],
    video_url: room.video_url || '',
    status: room.status || 'available',
  };

  if (room.id) {
    const { data, error } = await supabase
      .from('room_categories')
      .update(payload)
      .eq('id', room.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('room_categories')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function deleteRoomCategory(id: string): Promise<void> {
  const { error } = await supabase.from('room_categories').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 3. MEAL ADD-ONS & SERVICES
// ==========================================
export async function getActiveMealAddons(): Promise<MealAddon[]> {
  const { data, error } = await supabase
    .from('meal_addons')
    .select('id, name, code, description, price_adult, price_child, category, is_active, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data as MealAddon[]) || [];
}

export async function getAllAdminMealAddons(): Promise<MealAddon[]> {
  const { data, error } = await supabase
    .from('meal_addons')
    .select('id, name, code, description, price_adult, price_child, category, is_active, display_order')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data as MealAddon[]) || [];
}

export async function saveMealAddon(addon: Partial<MealAddon>): Promise<MealAddon> {
  if (addon.id) {
    const { data, error } = await supabase
      .from('meal_addons')
      .update(addon)
      .eq('id', addon.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('meal_addons')
      .insert(addon)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function deleteMealAddon(id: string): Promise<void> {
  const { error } = await supabase.from('meal_addons').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 4. PROMO CODES
// ==========================================
export async function validatePromoCode(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
  const cleanCode = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, min_spend, is_active')
    .eq('code', cleanCode)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, discount: 0, message: 'Invalid or expired promotional code' };
  }

  if (subtotal < data.min_spend) {
    return { valid: false, discount: 0, message: `Minimum spend of Rs. ${data.min_spend.toLocaleString()} required for this code` };
  }

  let discount = 0;
  if (data.discount_type === 'percentage') {
    discount = Math.round((subtotal * data.discount_value) / 100);
  } else {
    discount = data.discount_value;
  }

  return { valid: true, discount, message: `Code applied successfully! (Discount: Rs. ${discount.toLocaleString()})` };
}

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, code, discount_type, discount_value, min_spend, is_active');
  if (error) throw error;
  return data || [];
}

export async function savePromoCode(promo: Partial<PromoCode>): Promise<PromoCode> {
  if (promo.id) {
    const { data, error } = await supabase.from('promo_codes').update(promo).eq('id', promo.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('promo_codes').insert(promo).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deletePromoCode(id: string): Promise<void> {
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 5. BOOKINGS & RESERVATIONS
// ==========================================
export async function createBooking(booking: Omit<Booking, 'id' | 'reference' | 'created_at' | 'updated_at'>): Promise<Booking> {
  // Generate high-end booking reference: NTP-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `NTP-2026-${randomSuffix}`;

  const payload = {
    ...booking,
    reference,
    booking_status: 'pending_review',
    payment_status: booking.payment_method === 'pay_at_hotel' ? 'unpaid' : 'under_review',
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Failed to create booking in database:', error);
    throw error;
  }

  return data as Booking;
}

export async function getBookingByReference(reference: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('reference', reference.trim().toUpperCase())
    .single();

  if (error) return null;
  return data as Booking;
}

export async function getAdminBookings(statusFilter?: string): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('booking_status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Booking[]) || [];
}

export async function updateBookingStatus(
  id: string, 
  status: Booking['booking_status'], 
  paymentStatus?: Booking['payment_status'],
  notes?: string
): Promise<Booking> {
  const updatePayload: Record<string, unknown> = {
    booking_status: status,
    updated_at: new Date().toISOString(),
  };

  if (paymentStatus) {
    updatePayload.payment_status = paymentStatus;
  }
  if (notes !== undefined) {
    updatePayload.admin_notes = notes;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function updateBookingDetails(id: string, updates: Partial<Booking>): Promise<Booking> {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  delete (payload as Record<string, unknown>).id;

  const { data, error } = await supabase
    .from('bookings')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function deleteBooking(id: string, reference?: string): Promise<void> {
  if (reference) {
    try {
      await supabase.from('payment_proofs').delete().eq('booking_reference', reference);
    } catch {
      // ignore proof deletion failure
    }
  }
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteAllBookings(): Promise<void> {
  try {
    await supabase.from('payment_proofs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch {
    // ignore
  }
  const { error } = await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}

// ==========================================
// 6. HERO BANNERS & GALLERY
// ==========================================
export async function getHeroBanners(): Promise<HeroBanner[]> {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('id, title, subtitle, image_url, cta_text, cta_link, display_order, is_active')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data as HeroBanner[]) || [];
}

export async function getAllAdminHeroBanners(): Promise<HeroBanner[]> {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('id, title, subtitle, image_url, cta_text, cta_link, display_order, is_active')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveHeroBanner(banner: Partial<HeroBanner>): Promise<HeroBanner> {
  if (banner.id) {
    const { data, error } = await supabase.from('hero_banners').update(banner).eq('id', banner.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('hero_banners').insert(banner).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deleteHeroBanner(id: string): Promise<void> {
  const { error } = await supabase.from('hero_banners').delete().eq('id', id);
  if (error) throw error;
}

export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery_items')
    .select('id, title, image_url, category, display_order')
    .order('display_order', { ascending: true });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data as GalleryItem[]) || [];
}

export async function saveGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
  if (item.id) {
    const { data, error } = await supabase.from('gallery_items').update(item).eq('id', item.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('gallery_items').insert(item).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 7. PHYSICAL ROOMS INVENTORY
// ==========================================
export async function getPhysicalRooms(): Promise<PhysicalRoom[]> {
  const { data, error } = await supabase
    .from('physical_rooms')
    .select('id, room_number, category_id, floor, status, notes')
    .order('room_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function savePhysicalRoom(room: Partial<PhysicalRoom>): Promise<PhysicalRoom> {
  if (room.id) {
    const { data, error } = await supabase.from('physical_rooms').update(room).eq('id', room.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('physical_rooms').insert(room).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deletePhysicalRoom(id: string): Promise<void> {
  const { error } = await supabase.from('physical_rooms').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// 8. HOTEL SETTINGS
// ==========================================
export async function getHotelSettings(): Promise<HotelSettings> {
  const { data, error } = await supabase
    .from('hotel_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return {
      id: 1,
      hotel_name: 'New Taj Palace Hotel',
      phone: '+92 322 4845461',
      whatsapp: '923224845461',
      email: 'yasinjimi4u84@gmail.com',
      address: 'Near Rahber Travel, Opp City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan',
      google_maps_url: 'https://share.google/piBoQEYODJrE0SZoK',
      facebook_url: 'https://www.facebook.com/share/1HisKFMDMg/',
      instagram_url: 'https://instagram.com/newtajpalacehotel?obrf=Nm14eDlrdXhwb2V2',
      bank_name: 'Meezan Bank',
      bank_account_title: 'New Taj Palace Hotel',
      bank_account_number: '02010108492019',
      bank_iban: 'PK45MEZN0002010108492019',
      jazzcash_title: 'New Taj Palace Hotel',
      jazzcash_number: '03224845461',
      easypaisa_title: 'New Taj Palace Hotel',
      easypaisa_number: '03224845461',
      tax_percentage: 0,
      check_in_time: '02:00 PM',
      check_out_time: '12:00 PM',
      cancellation_policy: 'Free cancellation up to 24 hours prior to check-in. For late cancellations or no-shows, please contact the hotel directly.'
    };
  }

  return data as HotelSettings;
}

export async function updateHotelSettings(settings: Partial<HotelSettings>): Promise<HotelSettings> {
  const { data, error } = await supabase
    .from('hotel_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return data as HotelSettings;
}

// ==========================================
// 9. FAQS & CONTACT MESSAGES
// ==========================================
export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, display_order')
    .order('display_order', { ascending: true });

  if (error) return [];
  return data || [];
}

export async function saveFAQ(faq: Partial<FAQ>): Promise<FAQ> {
  if (faq.id) {
    const { data, error } = await supabase.from('faqs').update(faq).eq('id', faq.id).select().single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase.from('faqs').insert(faq).select().single();
    if (error) throw error;
    return data;
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw error;
}

export async function sendContactMessage(msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .insert({ ...msg, is_read: false });
  if (error) throw error;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
