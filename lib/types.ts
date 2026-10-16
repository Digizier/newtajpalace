export interface RoomCategory {
  id: string;
  name: string;
  slug: string;
  short_desc: string;
  description: string;
  base_price: number;
  max_adults: number;
  max_children: number;
  bed_type: string;
  room_size: string;
  featured_image: string;
  amenities: string[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface PhysicalRoom {
  id: string;
  room_number: string;
  category_id: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance';
  notes?: string;
  created_at?: string;
}

export interface MealAddon {
  id: string;
  name: string;
  code: string;
  description: string;
  price_adult: number;
  price_child: number;
  category: 'meal' | 'transport' | 'extra';
  is_active: boolean;
  display_order: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
}

export interface BookingMealSelection {
  code: string;
  name: string;
  adults_count: number;
  children_count: number;
  price_adult: number;
  price_child: number;
  total_per_night: number;
}

export interface Booking {
  id: string;
  reference: string;
  room_category_id: string;
  room_category_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  num_rooms: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  special_requests?: string;
  meal_addons_selected: BookingMealSelection[];
  room_total: number;
  addons_total: number;
  extra_charges?: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  payable_now: number;
  due_at_checkin: number;
  payment_method: 'pay_at_hotel' | 'bank_transfer';
  payment_status: 'unpaid' | 'proof_submitted' | 'under_review' | 'verified' | 'rejected';
  booking_status: 'pending_review' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  rejection_reason?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentProof {
  id: string;
  booking_reference: string;
  transaction_id?: string;
  proof_url: string;
  notes?: string;
  status: 'under_review' | 'verified' | 'rejected';
  created_at?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  display_order: number;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  title?: string;
  image_url: string;
  category: 'Rooms' | 'Bathrooms' | 'Dining' | 'Reception' | 'Exterior';
  display_order: number;
}

export interface HotelSettings {
  id: number;
  hotel_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  bank_name: string;
  bank_account_title: string;
  bank_account_number: string;
  bank_iban: string;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  tax_percentage: number;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}
