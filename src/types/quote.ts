import { Room } from './calculator';

export interface SavedQuote {
  id: string;
  user_id: string;
  name: string;
  data: Room[];
  vat_rate: number;
  prepared_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteFormData {
  name: string;
  saveToCloud: boolean;
}
