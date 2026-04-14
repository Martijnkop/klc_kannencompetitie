// API Response types
export interface UserLeaderboardEntry {
  rank: number;
  lid_naam: string;
  score: number;
  product_variety: number;
  total_items: number;
}

export interface GroupLeaderboardEntry {
  rank: number;
  group_id: number | null;
  group_name: string;
  score: number;
  product_variety: number;
  total_items: number;
  member_count: number;
}

export interface LeaderboardResponse<T> {
  type: 'user' | 'group';
  since: string;
  count: number;
  data: T[];
}

export interface Product {
  product_id: number;
  product_name: string;
  multiplier: number;
}

export interface User {
  lid_naam: string;
  group_id: number | null;
}

export interface Group {
  id: number;
  name: string;
}

export interface ProductSale {
  product_name: string;
  product_id: number;
  product_amount: string;
  product_price_paid: string | null;
  lid_naam: string | null;
}
