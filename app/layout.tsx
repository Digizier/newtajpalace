import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavBar from '@/components/MobileNavBar';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import ScrollToTop from '@/components/ScrollToTop';
import JsonLd from '@/components/JsonLd';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#11202A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://newtajpalace.com'),
  alternates: {
    canonical: 'https://newtajpalace.com',
  },
  title: {
    default: 'New Taj Palace Hotel Lahore | AC Rooms Near Bund Road & City Bus Terminal',
    template: '%s | New Taj Palace Hotel Lahore',
  },
  description:
    'Book comfortable & affordable accommodation at New Taj Palace Hotel, Bund Road, Lahore. Opposite City Bus Terminal & near Rahber Travels. Inverter AC, free Wi-Fi, 24/7 room service & secure parking.',
  keywords: [
    'New Taj Palace Hotel',
    'New Taj Palace Hotel Lahore',
    'Hotel in Lahore',
    'Bund Road Hotel Lahore',
    'Hotel near City Bus Terminal Lahore',
    'Budget Hotel Lahore',
    'Hotel near Rahber Travels Lahore',
    'Hotel near Bilal Travels Bund Road',
    'Family Hotel Lahore',
    'Room Booking Lahore',
    'Affordable AC Rooms Lahore',
    'Guest House Lahore Bund Road'
  ],
  authors: [{ name: 'New Taj Palace Hotel' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'New Taj Palace Hotel Lahore | Affordable & Comfortable Hotel',
    description: 'Affordable, clean, and comfortable hotel accommodation on Bund Road opposite City Bus Terminal, Lahore. Free Wi-Fi, AC, and 24/7 room service.',
    url: 'https://newtajpalace.com',
    siteName: 'New Taj Palace Hotel',
    images: [
      {
        url: '/images/rooms/room-2.webp',
        width: 1200,
        height: 800,
        alt: 'New Taj Palace Hotel Executive Suite Lahore',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Taj Palace Hotel Lahore | Affordable & Comfortable Hotel',
    description: 'Comfortable & clean hotel accommodation on Bund Road, opposite City Bus Terminal, Lahore. Free Wi-Fi, AC & 24/7 room service.',
    images: ['/images/rooms/room-2.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const hotelSchema = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  '@id': 'https://newtajpalace.com/#hotel',
  name: 'New Taj Palace Hotel',
  alternateName: ['New Taj Hotel Lahore', 'NTP Palace Hotel', 'Taj Palace Hotel Bund Road'],
  description: 'Affordable, clean, and comfortable hotel accommodation located on Main Bund Road, Lahore, Pakistan. Situated directly opposite the City Bus Terminal and near Rahber & Bilal Travels, featuring air-conditioned rooms, free high-speed Wi-Fi, 24/7 room service, and secure on-site parking.',
  url: 'https://newtajpalace.com',
  logo: 'https://newtajpalace.com/logo.png',
  image: [
    'https://newtajpalace.com/images/rooms/room-2.webp',
    'https://newtajpalace.com/images/rooms/room-9.webp',
    'https://newtajpalace.com/images/rooms/room-8.webp'
  ],
  telephone: '+923224845461',
  priceRange: 'PKR 3500 - PKR 14500',
  currenciesAccepted: 'PKR',
  paymentAccepted: 'Cash, Bank Transfer, JazzCash, EasyPaisa',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main Bund Road, near Bilal Travel & Rahber Travels, Opposite City Bus Terminal, Dholanwal',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54000',
    addressCountry: 'PK'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.5497,
    longitude: 74.2882
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59'
    }
  ],
  checkinTime: '12:00',
  checkoutTime: '11:00',
  starRating: {
    '@type': 'Rating',
    ratingValue: '4.5',
    bestRating: '5'
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed Wi-Fi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Inverter Air Conditioning & Heating', value: true },
    { '@type': 'LocationFeatureSpecification', name: '24/7 Room Service', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Secure Guest Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'En-Suite Private Bathroom', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Smart LED TV', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Hot Water Geyser', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Daily Housekeeping', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Family Suites Available', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Transit Bus Terminal Proximity', value: true }
  ],
  hasMap: 'https://maps.google.com/?q=New+Taj+Palace+Hotel+Bund+Road+Lahore',
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://newtajpalace.com/book',
      inLanguage: 'en',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform'
      ]
    },
    result: {
      '@type': 'LodgingReservation',
      name: 'Direct Online Room Reservation'
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <JsonLd data={hotelSchema} />
        {/* NADER HABIB SOLID FIRST-LAYER PROTECTION */}
        <script
          data-site-key="site_newtajpalace"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const SITE_KEY = "site_newtajpalace";
  const SUPABASE_URL = "https://pggolsqtamtkafrpigfo.supabase.co";
  const SUPABASE_KEY = "sb_publishable_XpYfaWv-_LNXEyJ5YAmRuw_q0wfyI8d";
  const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ29sc3F0YW10a2FmcnBpZ2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDE3ODgsImV4cCI6MjEwMDgxNzg4OH0.98_YWbdZ6hlpMiujbiWLYPRYlrvnx2_I31FyGILixHs";
  const WHATSAPP_NUM = "03222685868";
  const WHATSAPP_LINK = "https://wa.me/923222685868?text=Hi%20Nader%20Habib,%20I%20want%20to%20unlock%20my%20website.";
  const isTestLock = typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('lock=true');

  async function checkAccess() {
    if (isTestLock) {
      execLockOverlay('monthly');
      return;
    }

    try {
      const url = SUPABASE_URL + '/rest/v1/client_websites?site_key=eq.' + encodeURIComponent(SITE_KEY) + '&select=*';
      let res = await fetch(url, {
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': 'Bearer ' + SUPABASE_KEY 
        }
      });
      if (!res.ok) {
        res = await fetch(url, {
          headers: { 
            'apikey': FALLBACK_KEY, 
            'Authorization': 'Bearer ' + FALLBACK_KEY 
          }
        });
      }
      if (!res.ok) return;
      const data = await res.json();
      
      if (data && data.length > 0) {
        const item = data[0];
        const now = new Date();
        const expiry = new Date(item.expiry_date);
        const isExpired = now > expiry;
        const isDisabled = item.status === false;

        if (isExpired || isDisabled) {
          execLockOverlay(item.billing_cycle || 'monthly', item.custom_notice);
        }
      }
    } catch (e) {
      console.error('[Website-Controller] Access check failed:', e);
    }
  }

  function execLockOverlay(billingCycle, customNotice) {
    function inject() {
      if (document.getElementById('nader-habib-lock-overlay')) return;
      document.documentElement.style.overflow = 'hidden';
      if (document.body) document.body.style.overflow = 'hidden';

      const overlay = document.createElement('div');
      overlay.id = 'nader-habib-lock-overlay';
      overlay.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#030712!important;color:#ffffff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:system-ui,-apple-system,sans-serif!important;text-align:center!important;padding:20px!important;box-sizing:border-box!important;';

      const cycle = billingCycle === 'yearly' ? 'Yearly' : 'Monthly';
      const noticeText = customNotice || 'Your hosting subscription access is locked. Please contact Nader Habib on WhatsApp to pay remaining dues and restore access.';

      overlay.innerHTML = '<div style="max-width:520px;width:100%;background:rgba(17,24,39,0.95);border:1px solid rgba(239,68,68,0.4);border-radius:24px;padding:40px 32px;box-shadow:0 25px 50px -12px rgba(239,68,68,0.25);backdrop-filter:blur(16px);">' +
        '<div style="width:72px;height:72px;margin:0 auto 24px;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
        '</div>' +
        '<span style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.3);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 14px;border-radius:9999px;display:inline-block;margin-bottom:16px;">' +
          'Website Access Locked • ' + cycle + ' Payment Remaining' +
        '</span>' +
        '<h1 style="font-size:26px;font-weight:800;color:#ffffff;margin:0 0 12px 0;">Nader Habib Payment Remaining</h1>' +
        '<p style="font-size:15px;color:#9ca3af;line-height:1.6;margin:0 0 24px 0;">' +
          noticeText +
        '</p>' +
        '<div style="background:#1f2937;border:1px solid #374151;border-radius:16px;padding:16px;margin-bottom:24px;">' +
          '<div style="font-size:13px;color:#9ca3af;margin-bottom:4px;">Direct WhatsApp Support</div>' +
          '<div style="font-size:20px;font-weight:700;color:#10b981;">' + WHATSAPP_NUM + '</div>' +
        '</div>' +
        '<a href="' + WHATSAPP_LINK + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#10b981;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 24px;border-radius:14px;box-shadow:0 10px 20px -5px rgba(16,185,129,0.4);">' +
          'Contact Nader Habib on WhatsApp' +
        '</a>' +
      '</div>';
      document.documentElement.appendChild(overlay);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  checkAccess();
})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-neutral-900 selection:bg-gold-500 selection:text-white">
        <ScrollToTop />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileNavBar />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
