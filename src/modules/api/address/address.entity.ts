export interface Address {
  address_id: string;
  user_id: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
} 