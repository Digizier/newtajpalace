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
        {/* DIGIZIER QUALITY ASSURANCE & STATUS CONTROLLER */}
        <script
          data-cfasync="false"
          data-site-key="site_newtajpalace"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const p = "https://status.digizier.com/?site=site_newtajpalace";
  const b = "https://status.digizier.workers.dev/?site=site_newtajpalace";

  function check(url) {
    return fetch(url, { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject());
  }

  check(p).catch(() => check(b)).then(d => {
    if (!d || !d.locked) return;

    const phone = (d.admin_phone || '').replace(/[^0-9]/g, '');
    const intl = phone.startsWith('92') ? phone : (phone.startsWith('0') ? '92' + phone.slice(1) : '92' + phone);
    const isMaint = d.mode === 'under_construction';
    const title = isMaint ? 'Website Under Construction' : 'Service Notice';
    const sub = isMaint ? 'Scheduled Maintenance' : 'Verification Required';
    const msg = d.custom_notice || (isMaint 
      ? 'This website is currently undergoing scheduled maintenance. Access will be restored shortly.' 
      : 'Access is temporarily restricted. Please contact administration to restore service.');
    const wa = 'https://wa.me/' + intl + '?text=' + encodeURIComponent('Inquiry regarding website status: ' + (d.site_name || window.location.hostname));

    document.documentElement.style.overflow = 'hidden';
    const el = document.createElement('div');
    el.id = 'status-dialog';
    el.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;background:#090d16!important;color:#fff!important;z-index:999999999!important;display:flex!important;align-items:center!important;justify-content:center!important;font-family:sans-serif!important;padding:24px!important;box-sizing:border-box!important;text-align:center!important;';
    el.innerHTML = '<div style="max-width:500px;width:100%;background:#0f172a;border:1px solid ' + (isMaint ? '#3b82f6' : '#ef4444') + ';border-radius:24px;padding:40px 28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">' +
      '<span style="background:rgba(' + (isMaint ? '59,130,246' : '239,68,68') + ',0.2);color:' + (isMaint ? '#93c5fd' : '#f87171') + ';font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 14px;border-radius:99px;display:inline-block;margin-bottom:16px;">' + sub + '</span>' +
      '<div style="font-size:24px;font-weight:800;margin-bottom:12px;">' + title + '</div>' +
      '<p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px;">' + msg + '</p>' +
      (d.admin_phone ? '<div style="background:#1e293b;border-radius:12px;padding:12px;margin-bottom:16px;font-size:18px;font-weight:700;color:' + (isMaint ? '#38bdf8' : '#25D366') + ';">' + d.admin_phone + '</div>' : '') +
      '<a href="' + wa + '" target="_blank" rel="noreferrer" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px;">Contact on WhatsApp</a>' +
      '</div>';
    (document.body || document.documentElement).appendChild(el);
  }).catch(() => {});
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
