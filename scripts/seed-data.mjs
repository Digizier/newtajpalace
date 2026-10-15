import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.waudxkllolpvmeiwlbaz',
  password: 'jCJ!R&*HwZ%8UAm',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  await client.connect();
  console.log('Seeding initial hotel data...');

  // 1. Room Categories
  const rooms = [
    {
      name: 'Executive Suite',
      slug: 'executive-suite',
      short_desc: 'Spacious luxury suite with king bed, executive seating, and modern en-suite bath.',
      description: 'The Executive Suite at New Taj Palace Hotel offers refined comfort for business executives and discerning travelers. Features a plush king bed, dedicated work desk, comfortable seating lounge, 43-inch LED Smart TV, mini-fridge, and a spotless private bathroom with hot/cold shower.',
      base_price: 6500,
      max_adults: 2,
      max_children: 1,
      bed_type: '1 King Bed',
      room_size: '380 sq ft',
      featured_image: '/images/rooms/room-2.webp',
      amenities: JSON.stringify(['Free High-Speed Wi-Fi', 'Air Conditioning', 'En-Suite Bathroom', '43" LED Smart TV', 'Room Service', 'Mini Fridge', 'Work Desk', 'Free Toiletries']),
      is_featured: true,
      display_order: 1
    },
    {
      name: 'Deluxe King Room',
      slug: 'deluxe-king-room',
      short_desc: 'Comfortable king-bed room with contemporary decor, ideal for couples and professionals.',
      description: 'Designed for comfort and tranquility, our Deluxe King Room provides everything needed for a relaxing stay in Lahore. Features premium linen, quiet inverter air conditioning, attached washroom with instant geyser, and 24/7 room service.',
      base_price: 4500,
      max_adults: 2,
      max_children: 1,
      bed_type: '1 King Bed',
      room_size: '300 sq ft',
      featured_image: '/images/rooms/room-4.webp',
      amenities: JSON.stringify(['Free Wi-Fi', 'Inverter AC', 'Attached Bathroom', 'LED TV', '24/7 Room Service', 'Daily Housekeeping', 'Intercom']),
      is_featured: true,
      display_order: 2
    },
    {
      name: 'Family Quad Suite',
      slug: 'family-quad-suite',
      short_desc: 'Expansive family room accommodating up to 4 adults and 2 children with two double beds.',
      description: 'Traveling with family or relatives? The Family Quad Suite is your perfect haven. Offering ample living space, two double beds, extra wardrobe storage, and quick access to dining and transport services directly opposite the City Bus Terminal.',
      base_price: 8500,
      max_adults: 4,
      max_children: 2,
      bed_type: '2 Double Beds',
      room_size: '480 sq ft',
      featured_image: '/images/rooms/room-9.webp',
      amenities: JSON.stringify(['Free Wi-Fi', 'Spacious Seating', 'Inverter AC', 'Large En-Suite Bath', '43" LED TV', 'Tea/Coffee Facility', 'Room Service']),
      is_featured: true,
      display_order: 3
    },
    {
      name: 'Standard Double Room',
      slug: 'standard-double-room',
      short_desc: 'Affordable, clean, and practical double bedroom with all essential comforts.',
      description: 'Our Standard Double Room combines remarkable affordability with genuine hotel cleanliness. Ideal for budget travelers visiting Lahore for short or extended stays.',
      base_price: 3500,
      max_adults: 2,
      max_children: 1,
      bed_type: '1 Double Bed',
      room_size: '260 sq ft',
      featured_image: '/images/rooms/room-7.webp',
      amenities: JSON.stringify(['Free Wi-Fi', 'Air Cooling / AC', 'Private Bathroom', 'LED TV', 'Daily Housekeeping']),
      is_featured: false,
      display_order: 4
    },
    {
      name: 'Junior Executive Suite',
      slug: 'junior-executive-suite',
      short_desc: 'Cozy and stylish junior suite featuring a king bed and tea table setup.',
      description: 'The Junior Executive Suite strikes the sweet spot between luxury and value, offering peaceful ambiance, quality bedding, and prompt room service.',
      base_price: 5500,
      max_adults: 2,
      max_children: 1,
      bed_type: '1 King Bed',
      room_size: '340 sq ft',
      featured_image: '/images/rooms/room-10.webp',
      amenities: JSON.stringify(['Free High-Speed Wi-Fi', 'Inverter AC', 'Private Bath', 'Smart TV', 'Tea Setup', 'Room Service']),
      is_featured: true,
      display_order: 5
    },
    {
      name: 'Triple Bed Room',
      slug: 'triple-bed-room',
      short_desc: 'Ideal for friends or group travelers with three individual single beds.',
      description: 'Convenient triple bed arrangement offering comfortable individual sleeping spaces, secure luggage storage, and fast Wi-Fi.',
      base_price: 5000,
      max_adults: 3,
      max_children: 1,
      bed_type: '3 Single Beds',
      room_size: '360 sq ft',
      featured_image: '/images/rooms/room-11.webp',
      amenities: JSON.stringify(['Free Wi-Fi', 'Air Conditioning', 'Private Bathroom', 'LED TV', '24/7 Front Desk']),
      is_featured: false,
      display_order: 6
    },
    {
      name: 'Business Solo Room',
      slug: 'business-solo-room',
      short_desc: 'Compact private room tailored for single corporate travelers and drivers.',
      description: 'Affordable private retreat equipped with a comfortable single bed, desk, and attached bath.',
      base_price: 3000,
      max_adults: 1,
      max_children: 0,
      bed_type: '1 Single Bed',
      room_size: '200 sq ft',
      featured_image: '/images/rooms/room-3.webp',
      amenities: JSON.stringify(['Free Wi-Fi', 'Fan & AC', 'Attached Bath', 'Desk', 'Room Service']),
      is_featured: false,
      display_order: 7
    },
    {
      name: 'Master Presidential Suite',
      slug: 'master-presidential-suite',
      short_desc: 'Our premier luxury accommodation featuring grand master bed, sofa lounge, and VIP amenities.',
      description: 'The pinnacle of New Taj Palace hospitality. Expansive room layout with premium finishes, master king bed, plush velvet sofas, and dedicated staff assistance.',
      base_price: 10000,
      max_adults: 3,
      max_children: 2,
      bed_type: '1 Super King Bed',
      room_size: '550 sq ft',
      featured_image: '/images/rooms/room-1.webp',
      amenities: JSON.stringify(['Free Ultra High-Speed Wi-Fi', 'Dual Inverter AC', 'Luxury En-Suite Bathroom', '50" LED Smart TV', 'VIP Room Service', 'Welcome Tea & Refreshments', 'Lounge Area']),
      is_featured: true,
      display_order: 8
    }
  ];

  for (const r of rooms) {
    await client.query(`
      INSERT INTO public.room_categories (
        name, slug, short_desc, description, base_price, max_adults, max_children,
        bed_type, room_size, featured_image, amenities, is_featured, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        short_desc = EXCLUDED.short_desc,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        max_adults = EXCLUDED.max_adults,
        max_children = EXCLUDED.max_children,
        bed_type = EXCLUDED.bed_type,
        room_size = EXCLUDED.room_size,
        featured_image = EXCLUDED.featured_image,
        amenities = EXCLUDED.amenities,
        is_featured = EXCLUDED.is_featured,
        display_order = EXCLUDED.display_order;
    `, [
      r.name, r.slug, r.short_desc, r.description, r.base_price, r.max_adults, r.max_children,
      r.bed_type, r.room_size, r.featured_image, r.amenities, r.is_featured, r.display_order
    ]);
  }
  console.log(`Seeded ${rooms.length} room categories.`);

  // 2. Physical Inventory
  const resRooms = await client.query('SELECT id, slug FROM public.room_categories');
  const catMap = Object.fromEntries(resRooms.rows.map(r => [r.slug, r.id]));

  const physical = [
    { num: '101', slug: 'deluxe-king-room', floor: '1st Floor' },
    { num: '102', slug: 'deluxe-king-room', floor: '1st Floor' },
    { num: '103', slug: 'standard-double-room', floor: '1st Floor' },
    { num: '104', slug: 'business-solo-room', floor: '1st Floor' },
    { num: '201', slug: 'executive-suite', floor: '2nd Floor' },
    { num: '202', slug: 'executive-suite', floor: '2nd Floor' },
    { num: '203', slug: 'junior-executive-suite', floor: '2nd Floor' },
    { num: '204', slug: 'triple-bed-room', floor: '2nd Floor' },
    { num: '301', slug: 'family-quad-suite', floor: '3rd Floor' },
    { num: '302', slug: 'family-quad-suite', floor: '3rd Floor' },
    { num: '303', slug: 'master-presidential-suite', floor: '3rd Floor' }
  ];

  for (const p of physical) {
    if (catMap[p.slug]) {
      await client.query(`
        INSERT INTO public.physical_rooms (room_number, category_id, floor, status)
        VALUES ($1, $2, $3, 'available')
        ON CONFLICT (room_number) DO NOTHING;
      `, [p.num, catMap[p.slug], p.floor]);
    }
  }
  console.log('Seeded physical rooms.');

  // 3. Meal Add-ons
  const meals = [
    { name: 'Continental & Desi Breakfast Buffet', code: 'BREAKFAST', desc: 'Fresh parathas, eggs, chai/coffee, toast, butter, jam & halwa puri.', price_adult: 800, price_child: 500, category: 'meal', display_order: 1 },
    { name: 'Royal Dinner Set Menu', code: 'DINNER', desc: 'Chicken Karahi / Biryani, fresh naan, salad, raita, and dessert.', price_adult: 1400, price_child: 850, category: 'meal', display_order: 2 },
    { name: 'Executive Lunch Platter', code: 'LUNCH', desc: 'Freshly prepared day special Pakistani cuisine served to your room.', price_adult: 1100, price_child: 650, category: 'meal', display_order: 3 },
    { name: 'City Bus Terminal / Airport Shuttle Service', code: 'SHUTTLE', desc: 'Pick-up and drop-off service by car.', price_adult: 1500, price_child: 0, category: 'transport', display_order: 4 },
    { name: 'Extra Folding Mattress with Linen', code: 'EXTRA_BED', desc: 'Comfortable additional mattress with fresh bedsheet and pillow.', price_adult: 1000, price_child: 1000, category: 'extra', display_order: 5 }
  ];

  for (const m of meals) {
    await client.query(`
      INSERT INTO public.meal_addons (name, code, description, price_adult, price_child, category, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price_adult = EXCLUDED.price_adult,
        price_child = EXCLUDED.price_child;
    `, [m.name, m.code, m.desc, m.price_adult, m.price_child, m.category, m.display_order]);
  }
  console.log('Seeded meal add-ons.');

  // 4. Promo Codes
  await client.query(`
    INSERT INTO public.promo_codes (code, discount_type, discount_value, min_spend)
    VALUES 
      ('WELCOME10', 'percentage', 10, 3000),
      ('TAJPALACE', 'fixed', 500, 4000)
    ON CONFLICT (code) DO NOTHING;
  `);
  console.log('Seeded promo codes.');

  // 5. Hero Banners
  await client.query(`
    DELETE FROM public.hero_banners;
    INSERT INTO public.hero_banners (title, subtitle, image_url, cta_text, cta_link, display_order)
    VALUES 
      ('Comfort & Luxury at Affordable Rates', 'Opposite City Bus Terminal, Bund Road, Lahore. Modern air-conditioned rooms, free Wi-Fi, and 24/7 room service.', '/images/rooms/room-2.webp', 'Book Your Stay', '/book', 1),
      ('Your Perfect Family Stay in Lahore', 'Spacious executive suites and family rooms designed for comfort and convenience.', '/images/rooms/room-9.webp', 'Explore Rooms', '/rooms', 2),
      ('Ideal for Business & Transit Travelers', 'Walking distance from Rahber Travels and major bus terminals with secure parking.', '/images/rooms/room-4.webp', 'Check Availability', '/book', 3);
  `);
  console.log('Seeded hero banners.');

  // 6. Gallery Items
  await client.query(`
    DELETE FROM public.gallery_items;
    INSERT INTO public.gallery_items (title, image_url, category, display_order)
    VALUES 
      ('Executive Suite Bedroom', '/images/rooms/room-2.webp', 'Rooms', 1),
      ('Deluxe King Bed', '/images/rooms/room-4.webp', 'Rooms', 2),
      ('En-Suite Bathroom & Vanity', '/images/rooms/room-6.webp', 'Bathrooms', 3),
      ('Modern Clean Washroom', '/images/rooms/room-7.webp', 'Bathrooms', 4),
      ('Family Quad Suite', '/images/rooms/room-9.webp', 'Rooms', 5),
      ('Junior Suite Comfort', '/images/rooms/room-10.webp', 'Rooms', 6),
      ('Triple Bed Arrangement', '/images/rooms/room-11.webp', 'Rooms', 7),
      ('Reception & Waiting Lounge', '/images/rooms/room-1.webp', 'Reception', 8),
      ('Hotel Frontage & Parking', '/images/rooms/room-13.webp', 'Exterior', 9);
  `);
  console.log('Seeded gallery items.');

  // 7. FAQs
  await client.query(`
    DELETE FROM public.faqs;
    INSERT INTO public.faqs (question, answer, display_order)
    VALUES 
      ('Where is New Taj Palace Hotel located?', 'We are conveniently located on Bund Road, Dholanwal, Lahore, right near Rahber Travels and directly opposite the City Bus Terminal. This makes our hotel exceptionally easy to access for bus travelers, families, and city visitors.', 1),
      ('How do I request a room booking?', 'Simply choose your desired dates, select a room category and any optional meal services on our website, fill out your guest details, and submit your reservation. You will receive an instant booking reference and confirmation voucher.', 2),
      ('Can I choose to Pay at the Hotel upon arrival?', 'Yes! We offer both Cash on Arrival (Pay at Hotel) and online advance payment via Bank Transfer, JazzCash, or EasyPaisa.', 3),
      ('What are the check-in and check-out timings?', 'Standard check-in time is 02:00 PM and check-out time is 12:00 PM. Early check-in or late check-out can be arranged subject to room availability upon contacting front desk.', 4),
      ('Is free parking and high-speed Wi-Fi provided?', 'Yes! We provide complimentary on-site parking for all guests and free high-speed Wi-Fi in all rooms and public lounges.', 5),
      ('What documents are required during check-in?', 'In accordance with local regulations, a valid original Computerized National Identity Card (CNIC) or Passport is required for each adult guest at check-in.', 6);
  `);
  console.log('Seeded FAQs.');

  await client.end();
  console.log('All initial hotel database data seeded successfully!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
