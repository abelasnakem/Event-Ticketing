import dayjs from 'dayjs';

export type TicketTier = {
  id: string;
  label: string;
  price: number;
  total: number;
  sold: number;
  perks?: string[];
};

export type ScannerDevice = {
  id: string;
  label: string;
  phone: string;
  invitationCode: string;
  status: 'invited' | 'active';
};

export type OrganizerEvent = {
  id: string;
  name: string;
  city: string;
  venue: string;
  datetime: string;
  status: 'Draft' | 'Published' | 'Live';
  link: string;
  bannerUrl?: string;
  brandColor?: string;
  categories?: string[];
  tickets: TicketTier[];
  scanners: ScannerDevice[];
};

export const organizerEvents: OrganizerEvent[] = [
  {
    id: 'evt-gize-2045',
    name: 'Gize Concert Night',
    city: 'Addis Ababa',
    venue: 'Friendship Park',
    datetime: dayjs().add(14, 'day').toISOString(),
    status: 'Published',
    link: 'https://digis.events/e/evt-gize-2045',
    bannerUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80',
    brandColor: '#ff6b6b',
    categories: ['Concert', 'Afrobeats'],
    tickets: [
      { id: 'regular', label: 'Regular', price: 700, total: 12000, sold: 9230, perks: ['Field access', 'Merch lane'] },
      { id: 'vip', label: 'VIP', price: 2200, total: 3000, sold: 1980, perks: ['Raised deck', 'Complimentary drink'] },
      { id: 'vvip', label: 'VVIP', price: 4500, total: 400, sold: 260, perks: ['Backstage greet', 'Bottle service'] },
    ],
    scanners: [
      { id: 'scan-1', label: 'North Gate', phone: '+251911223344', invitationCode: 'GIZE94', status: 'active' },
      { id: 'scan-2', label: 'VIP Lounge', phone: '+251921556677', invitationCode: 'GIZE55', status: 'invited' },
    ],
  },
  {
    id: 'evt-tech-5123',
    name: 'Tech Innovate ETH',
    city: 'Addis Ababa',
    venue: 'Millennium Hall',
    datetime: dayjs().add(32, 'day').toISOString(),
    status: 'Draft',
    link: 'https://digis.events/e/evt-tech-5123',
    bannerUrl: 'https://images.unsplash.com/photo-1515165562835-c4c1bfa5c0b0?auto=format&fit=crop&w=900&q=80',
    brandColor: '#4dabf7',
    categories: ['Conference', 'Startup'],
    tickets: [
      { id: 'regular', label: 'General', price: 950, total: 1500, sold: 400, perks: ['Expo floor', 'Coffee station'] },
      { id: 'vip', label: 'Founder Pass', price: 3200, total: 200, sold: 40, perks: ['Investor lounge', 'VIP dinner'] },
    ],
    scanners: [
      { id: 'scan-3', label: 'Hall A', phone: '+251910000011', invitationCode: 'TECH21', status: 'invited' },
    ],
  },
];

export function getOrganizerEvent(eventId: string) {
  return organizerEvents.find((event) => event.id === eventId);
}
