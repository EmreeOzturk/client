export interface User {
  id: string;
  email: string | null;
  walletAddress: string | null;
  isBlacklisted: boolean;
  createdAt: string;
  // Optional fields from schema
  fullName?: string | null;
  gsmNumber?: string | null;
}

export interface Order {
  id: string;
  wertOrderId: string;
  status: string;
  commodity: string;
  commodityAmount: number;
  currency: string;
  currencyAmount: number;
  createdAt: string;
  user: User; // Orders will likely be populated with user info
} 