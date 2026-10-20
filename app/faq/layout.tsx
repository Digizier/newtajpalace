import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | New Taj Palace Hotel Lahore',
  description:
    'Got questions about room booking, check-in times, Wi-Fi, parking, or location on Bund Road? Read our FAQs or contact New Taj Palace Hotel Lahore directly.',
  alternates: {
    canonical: 'https://newtajpalace.com/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions | New Taj Palace Hotel Lahore',
    description: 'Find instant answers about accommodation, amenities, and transit booking policies in Lahore.',
    url: 'https://newtajpalace.com/faq',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'New Taj Palace Hotel FAQs' }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is New Taj Palace Hotel located in Lahore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New Taj Palace Hotel is conveniently situated on Main Bund Road in Dholanwal, Lahore, Pakistan. It is located directly opposite the City Bus Terminal and within immediate walking distance of Bilal Travels and Rahber Travels.'
      }
    },
    {
      '@type': 'Question',
      name: 'What are the check-in and check-out timings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard guest check-in begins at 12:00 PM (noon), and check-out is until 11:00 AM. 24-hour front desk service is available for early arrivals or late night check-ins.'
      }
    },
    {
      '@type': 'Question',
      name: 'What room amenities are provided at New Taj Palace Hotel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All guest rooms and suites include silent inverter air conditioning and heating, high-speed free Wi-Fi, flat-screen Smart LED TV, private attached bathroom with hot water geyser, complimentary toiletries, electric kettle, executive work desk, and 24/7 room service.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are family rooms and executive suites available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, New Taj Palace Hotel offers spacious Family Quad Suites that comfortably accommodate up to 5 guests, Deluxe King Rooms for couples, and Executive Suites with dedicated lounge seating for business travelers.'
      }
    },
    {
      '@type': 'Question',
      name: 'What payment methods can I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept Cash upon check-in at the hotel, direct Bank Transfer (Meezan Bank), JazzCash, and EasyPaisa mobile payments with instant online booking confirmation.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is secure parking available at the hotel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, New Taj Palace Hotel provides safe and convenient on-site vehicle parking with 24/7 security surveillance for all registered guests.'
      }
    }
  ]
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
