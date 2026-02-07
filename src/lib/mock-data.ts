// Mock data for development/demo

import { GiftList, Gift, Contribution, User } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'jos.hovinga@gmail.com',
  name: 'Jos Hovinga',
  created_at: new Date().toISOString(),
};

export const mockList: GiftList = {
  id: '1',
  user_id: '1',
  slug: 'bram-en-frank',
  couple_names: 'Bram en Frank',
  wedding_date: '2028-12-12',
  description: 'Leuk dat je naar onze lijst kijkt!',
  cover_image: '/images/cover-placeholder.jpg',
  is_published: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockGifts: Gift[] = [
  {
    id: '1',
    list_id: '1',
    title: 'Koffiezetapparaat',
    description: 'Voor de perfecte kop koffie elke ochtend',
    image: '/images/gift-coffee.jpg',
    target_amount: 150,
    received_amount: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    list_id: '1',
    title: 'Airfryer',
    description: 'Voor de lekkerste snacks',
    image: '/images/gift-airfryer.jpg',
    target_amount: 200,
    received_amount: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    list_id: '1',
    title: 'Huwelijksreis',
    description: 'Help ons dromen waar te maken!',
    image: '/images/gift-travel.jpg',
    target_amount: 2000,
    received_amount: 350,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockContributions: Contribution[] = [
  {
    id: '1',
    gift_id: '1',
    amount: 50,
    message: 'Gefeliciteerd met jullie grote dag!',
    donor_name: 'Oma Truus',
    status: 'completed',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    gift_id: '1',
    amount: 25,
    message: 'Veel geluk samen!',
    donor_name: 'Jan & Marie',
    status: 'completed',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    gift_id: '2',
    amount: 50,
    message: 'Voor de lekkerste bitterballen!',
    donor_name: 'Collega\'s',
    status: 'completed',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    gift_id: '3',
    amount: 200,
    message: 'Geniet van jullie reis!',
    donor_name: 'Familie Jansen',
    status: 'completed',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    gift_id: '3',
    amount: 150,
    message: 'Maak er wat moois van!',
    donor_name: 'Vrienden',
    status: 'completed',
    created_at: new Date().toISOString(),
  },
];

// Helper functions
export function getListBySlug(slug: string): GiftList | undefined {
  if (slug === mockList.slug) return mockList;
  return undefined;
}

export function getGiftsByListId(listId: string): Gift[] {
  return mockGifts.filter(g => g.list_id === listId);
}

export function getContributionsByGiftId(giftId: string): Contribution[] {
  return mockContributions.filter(c => c.gift_id === giftId);
}

export function getTotalReceived(listId: string): number {
  const gifts = getGiftsByListId(listId);
  return gifts.reduce((sum, gift) => sum + gift.received_amount, 0);
}

export function getTotalTransactions(listId: string): number {
  const gifts = getGiftsByListId(listId);
  const giftIds = gifts.map(g => g.id);
  return mockContributions.filter(c => giftIds.includes(c.gift_id)).length;
}
