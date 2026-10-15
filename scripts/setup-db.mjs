import pg from 'pg';
const { Client } = pg;

const dbConfig = {
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.waudxkllolpvmeiwlbaz',
  password: 'jCJ!R&*HwZ%8UAm',
  ssl: { rejectUnauthorized: false }
};

async function setup() {
  console.log('Connecting to PostgreSQL database at aws-0-ap-northeast-1.pooler.supabase.com...');
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('PostgreSQL Connected successfully!');

    console.log('Creating database schema and tables...');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- 1. Room Categories
      CREATE TABLE IF NOT EXISTS public.room_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        short_desc TEXT,
        description TEXT,
        base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        max_adults INT NOT NULL DEFAULT 2,
        max_children INT NOT NULL DEFAULT 1,
        bed_type TEXT DEFAULT 'King Bed',
        room_size TEXT DEFAULT '320 sq ft',
        featured_image TEXT,
        amenities JSONB DEFAULT '[]'::jsonb,
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Room Images
      CREATE TABLE IF NOT EXISTS public.room_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        room_category_id UUID REFERENCES public.room_categories(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 3. Physical Rooms Inventory
      CREATE TABLE IF NOT EXISTS public.physical_rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        room_number TEXT NOT NULL UNIQUE,
        category_id UUID REFERENCES public.room_categories(id) ON DELETE CASCADE,
        floor TEXT DEFAULT '1st Floor',
        status TEXT DEFAULT 'available',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 4. Meal Add-ons & Extra Services
      CREATE TABLE IF NOT EXISTS public.meal_addons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        price_adult NUMERIC(10,2) NOT NULL DEFAULT 0,
        price_child NUMERIC(10,2) NOT NULL DEFAULT 0,
        category TEXT DEFAULT 'meal',
        is_active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 5. Promo Codes
      CREATE TABLE IF NOT EXISTS public.promo_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL DEFAULT 'percentage',
        discount_value NUMERIC(10,2) NOT NULL DEFAULT 10,
        min_spend NUMERIC(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 6. Bookings
      CREATE TABLE IF NOT EXISTS public.bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reference TEXT UNIQUE NOT NULL,
        room_category_id UUID REFERENCES public.room_categories(id) ON DELETE SET NULL,
        room_category_name TEXT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        nights INT NOT NULL DEFAULT 1,
        adults INT NOT NULL DEFAULT 1,
        children INT NOT NULL DEFAULT 0,
        num_rooms INT NOT NULL DEFAULT 1,
        guest_name TEXT NOT NULL,
        guest_phone TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        special_requests TEXT,
        meal_addons_selected JSONB DEFAULT '[]'::jsonb,
        room_total NUMERIC(10,2) NOT NULL DEFAULT 0,
        addons_total NUMERIC(10,2) NOT NULL DEFAULT 0,
        discount_total NUMERIC(10,2) NOT NULL DEFAULT 0,
        tax_total NUMERIC(10,2) NOT NULL DEFAULT 0,
        grand_total NUMERIC(10,2) NOT NULL DEFAULT 0,
        payable_now NUMERIC(10,2) NOT NULL DEFAULT 0,
        due_at_checkin NUMERIC(10,2) NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL DEFAULT 'pay_at_hotel',
        payment_status TEXT NOT NULL DEFAULT 'unpaid',
        booking_status TEXT NOT NULL DEFAULT 'pending_review',
        rejection_reason TEXT,
        admin_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 7. Payment Proofs
      CREATE TABLE IF NOT EXISTS public.payment_proofs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_reference TEXT NOT NULL,
        transaction_id TEXT,
        proof_url TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'under_review',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 8. Hero Banners
      CREATE TABLE IF NOT EXISTS public.hero_banners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        subtitle TEXT,
        image_url TEXT NOT NULL,
        cta_text TEXT DEFAULT 'Book Your Stay',
        cta_link TEXT DEFAULT '/book',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 9. Gallery Items
      CREATE TABLE IF NOT EXISTS public.gallery_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Rooms',
        display_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 10. Hotel Settings (Singleton)
      CREATE TABLE IF NOT EXISTS public.hotel_settings (
        id INT PRIMARY KEY DEFAULT 1,
        hotel_name TEXT NOT NULL DEFAULT 'New Taj Palace Hotel',
        phone TEXT DEFAULT '+92 322 4845461',
        whatsapp TEXT DEFAULT '923224845461',
        email TEXT DEFAULT 'yasinjimi4u84@gmail.com',
        address TEXT DEFAULT 'Near Rahber Travel, Opp City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan',
        google_maps_url TEXT DEFAULT 'https://share.google/piBoQEYODJrE0SZoK',
        facebook_url TEXT DEFAULT 'https://www.facebook.com/share/1HisKFMDMg/',
        instagram_url TEXT DEFAULT 'https://instagram.com/newtajpalacehotel?obrf=Nm14eDlrdXhwb2V2',
        bank_name TEXT DEFAULT 'Meezan Bank',
        bank_account_title TEXT DEFAULT 'New Taj Palace Hotel',
        bank_account_number TEXT DEFAULT '02010108492019',
        bank_iban TEXT DEFAULT 'PK45MEZN0002010108492019',
        jazzcash_title TEXT DEFAULT 'New Taj Palace Hotel',
        jazzcash_number TEXT DEFAULT '03224845461',
        easypaisa_title TEXT DEFAULT 'New Taj Palace Hotel',
        easypaisa_number TEXT DEFAULT '03224845461',
        tax_percentage NUMERIC(5,2) DEFAULT 0.00,
        check_in_time TEXT DEFAULT '02:00 PM',
        check_out_time TEXT DEFAULT '12:00 PM',
        cancellation_policy TEXT DEFAULT 'Free cancellation up to 24 hours prior to check-in. For late cancellations or no-shows, please contact the hotel directly.',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 11. FAQs
      CREATE TABLE IF NOT EXISTS public.faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 12. Contact Messages
      CREATE TABLE IF NOT EXISTS public.contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Enable Row Level Security (RLS) on all tables
      ALTER TABLE public.room_categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.physical_rooms ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.meal_addons ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.hotel_settings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

      -- Permissive Policies for seamless client-side reading and guest interaction
      DO $$
      DECLARE
        t text;
      BEGIN
        FOR t IN 
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
            AND table_name IN ('room_categories', 'room_images', 'physical_rooms', 'meal_addons', 'promo_codes', 'bookings', 'payment_proofs', 'hero_banners', 'gallery_items', 'hotel_settings', 'faqs', 'contact_messages')
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS "Public access" ON public.%I', t);
          EXECUTE format('CREATE POLICY "Public access" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
        END LOOP;
      END $$;

      -- Seed Hotel Settings singleton if not present
      INSERT INTO public.hotel_settings (id, hotel_name)
      VALUES (1, 'New Taj Palace Hotel')
      ON CONFLICT (id) DO NOTHING;

      -- Enable Realtime publication for key tables
      ALTER PUBLICATION supabase_realtime ADD TABLE public.room_categories, public.bookings, public.hero_banners, public.hotel_settings;
    `);

    console.log('Database tables, indexes, RLS policies, and realtime publication created successfully!');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setup();
