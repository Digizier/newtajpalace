/**
 * Automatic SEO & Google Hotel Feed Generator
 * Generates:
 * - public/sitemap.xml
 * - public/hotel-feed.xml
 * Run automatically during build or on demand: node scripts/generate-seo.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://newtajpalace.com';
const TODAY = new Date().toISOString().split('T')[0];

const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'rooms', priority: '0.9', changefreq: 'daily' },
  { path: 'pricing', priority: '0.9', changefreq: 'daily' },
  { path: 'book', priority: '0.9', changefreq: 'daily' },
  { path: 'about', priority: '0.8', changefreq: 'weekly' },
  { path: 'contact', priority: '0.8', changefreq: 'weekly' },
  { path: 'gallery', priority: '0.8', changefreq: 'weekly' },
  { path: 'faq', priority: '0.8', changefreq: 'weekly' },
  { path: 'voucher', priority: '0.7', changefreq: 'weekly' },
  { path: 'cancellation-policy', priority: '0.5', changefreq: 'monthly' },
  { path: 'terms', priority: '0.5', changefreq: 'monthly' },
  { path: 'privacy-policy', priority: '0.5', changefreq: 'monthly' },
];

const ROOM_CATEGORIES = [
  { slug: 'executive-suite', name: 'Executive Suite', capacity: 3, bed: 'King Bed + Lounge', price: 8500 },
  { slug: 'deluxe-king-room', name: 'Deluxe King Room', capacity: 2, bed: 'King Bed', price: 6500 },
  { slug: 'family-quad-suite', name: 'Family Quad Suite', capacity: 5, bed: 'Two Queen Beds', price: 11500 },
  { slug: 'standard-double-room', name: 'Standard Double Room', capacity: 2, bed: 'Double Bed', price: 5000 },
  { slug: 'junior-executive-suite', name: 'Junior Executive Suite', capacity: 2, bed: 'Queen Bed', price: 7200 },
  { slug: 'triple-bed-room', name: 'Triple Bed Room', capacity: 3, bed: 'Three Single Beds', price: 7800 },
  { slug: 'business-solo-room', name: 'Business Solo Room', capacity: 1, bed: 'Single Bed', price: 4200 },
  { slug: 'master-presidential-suite', name: 'Master Presidential Suite', capacity: 4, bed: 'Super King + Executive Lounge', price: 14500 },
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Static Pages
  STATIC_PAGES.forEach(p => {
    const loc = p.path ? `${BASE_URL}/${p.path}/` : `${BASE_URL}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    if (!p.path) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${BASE_URL}/images/rooms/room-2.webp</image:loc>\n`;
      xml += `      <image:title>New Taj Palace Hotel Lahore Executive Suite</image:title>\n`;
      xml += `      <image:caption>Comfortable and affordable hotel accommodation on Bund Road opposite City Bus Terminal Lahore</image:caption>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  // Room Pages
  ROOM_CATEGORIES.forEach(r => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/rooms/${r.slug}/</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[SEO-Generator] Generated sitemap with ${STATIC_PAGES.length + ROOM_CATEGORIES.length} URLs -> public/sitemap.xml`);
}

function generateHotelFeed() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<!--\n  Google Hotel Center & Google Maps Hotel List Feed\n  Property: New Taj Palace Hotel, Lahore, Pakistan\n  Feed URL: ${BASE_URL}/hotel-feed.xml\n-->\n`;
  xml += `<listings>\n`;
  xml += `  <language>en</language>\n`;
  xml += `  <listing>\n`;
  xml += `    <id>newtajpalace-lahore</id>\n`;
  xml += `    <name>New Taj Palace Hotel</name>\n`;
  xml += `    <address format="simple">\n`;
  xml += `      <component name="addr1">Main Bund Road, Near Rahber &amp; Bilal Travels, Opposite City Bus Terminal, Dholanwal</component>\n`;
  xml += `      <component name="city">Lahore</component>\n`;
  xml += `      <component name="province">Punjab</component>\n`;
  xml += `      <component name="postal_code">54000</component>\n`;
  xml += `      <component name="country">PK</component>\n`;
  xml += `    </address>\n`;
  xml += `    <country>PK</country>\n`;
  xml += `    <latitude>31.5497</latitude>\n`;
  xml += `    <longitude>74.2882</longitude>\n`;
  xml += `    <phone type="main">+923224845461</phone>\n`;
  xml += `    <phone type="booking">+923224845461</phone>\n`;
  xml += `    <category>hotel</category>\n`;
  xml += `    <website>${BASE_URL}/</website>\n`;
  xml += `    <booking_url>${BASE_URL}/book/</booking_url>\n`;
  xml += `    <image_url>${BASE_URL}/images/rooms/room-2.webp</image_url>\n`;
  xml += `    <description>New Taj Palace Hotel offers comfortable and affordable accommodation on Bund Road, Lahore. Opposite the City Bus Terminal and near Rahber &amp; Bilal Travels. Features inverter AC, free high-speed Wi-Fi, 24/7 room service, secure on-site parking, and private bathrooms.</description>\n`;
  xml += `    <amenities>\n`;
  xml += `      <amenity>wifi</amenity>\n`;
  xml += `      <amenity>air_conditioning</amenity>\n`;
  xml += `      <amenity>parking</amenity>\n`;
  xml += `      <amenity>room_service</amenity>\n`;
  xml += `      <amenity>front_desk_24hr</amenity>\n`;
  xml += `      <amenity>private_bathroom</amenity>\n`;
  xml += `      <amenity>housekeeping</amenity>\n`;
  xml += `      <amenity>heating</amenity>\n`;
  xml += `    </amenities>\n`;
  xml += `    <rooms>\n`;

  ROOM_CATEGORIES.forEach(r => {
    xml += `      <room>\n`;
    xml += `        <id>${r.slug}</id>\n`;
    xml += `        <name>${r.name}</name>\n`;
    xml += `        <capacity>${r.capacity}</capacity>\n`;
    xml += `        <bed_type>${r.bed}</bed_type>\n`;
    xml += `        <price currency="PKR">${r.price}</price>\n`;
    xml += `        <url>${BASE_URL}/rooms/${r.slug}/</url>\n`;
    xml += `      </room>\n`;
  });

  xml += `    </rooms>\n`;
  xml += `  </listing>\n`;
  xml += `</listings>\n`;

  const feedPath = path.join(__dirname, '..', 'public', 'hotel-feed.xml');
  fs.writeFileSync(feedPath, xml, 'utf8');
  console.log(`[SEO-Generator] Generated Google Hotel Center feed -> public/hotel-feed.xml`);
}

try {
  generateSitemap();
  generateHotelFeed();
  console.log('[SEO-Generator] All SEO feeds synced successfully.');
} catch (err) {
  console.error('[SEO-Generator] Error generating SEO feeds:', err);
}
