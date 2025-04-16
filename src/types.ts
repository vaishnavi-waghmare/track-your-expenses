export type TransactionCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Income'
  | 'Other';

export interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  category: TransactionCategory;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
}

export interface BudgetFormData {
  category: TransactionCategory;
  amount: string;
}

export interface Budget {
  category: TransactionCategory;
  amount: number;
}

export interface CategorySummary {
  category: TransactionCategory;
  total: number;
  percentage: number;
}