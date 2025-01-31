export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export type ExpenseInput = {
  amount: string | number;
  category: string;
  description: string | null;
  date: string;
};