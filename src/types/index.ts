// Database types for Felicio clone

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  iban?: string;
  created_at: string;
}

export interface GiftList {
  id: string;
  user_id: string;
  slug: string;
  couple_names: string;
  wedding_date: string;
  description?: string;
  cover_image?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gift {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  image?: string;
  target_amount: number;
  received_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  gift_id: string;
  amount: number;
  message?: string;
  donor_name?: string;
  donor_email?: string;
  stripe_payment_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

// Form types
export interface CreateListForm {
  couple_names: string;
  wedding_date: string;
}

export interface ListSettingsForm {
  description?: string;
  cover_image?: string;
  slug: string;
}

export interface CreateGiftForm {
  title: string;
  description?: string;
  image?: string;
  target_amount: number;
}

export interface ContributionForm {
  amount: number;
  message?: string;
  donor_name?: string;
  donor_email?: string;
}
