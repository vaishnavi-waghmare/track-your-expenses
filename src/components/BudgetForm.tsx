import { useState } from 'react';
import { PlusCircle, Hash, Tag } from 'lucide-react';
import type { BudgetFormData, TransactionCategory } from '../types';

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  existingCategories: TransactionCategory[];
}

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Other'
];

export function BudgetForm({ onSubmit, existingCategories }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: EXPENSE_CATEGORIES[0],
    amount: ''
  });

  const availableCategories = EXPENSE_CATEGORIES.filter(
    category => !existingCategories.includes(category)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    onSubmit(formData);
    setFormData({
      category: availableCategories[0] || EXPENSE_CATEGORIES[0],
      amount: ''
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 px-4 py-3">
        <h2 className="text-white font-semibold">Set Monthly Budget</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="budget-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <select
                id="budget-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={availableCategories.length === 0}
              >
                {availableCategories.length > 0 ? (
                  availableCategories.map((category) => (
                    <option key={category} value={category} className="dark:bg-slate-700">
                      {category}
                    </option>
                  ))
                ) : (
                  <option value="" className="dark:bg-slate-700">All categories have budgets</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="budget-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Budget (₹)
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="number"
                id="budget-amount"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
                disabled={availableCategories.length === 0}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 sm:text-sm">₹</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={availableCategories.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Set Budget
          </button>
          
          {availableCategories.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              You've set budgets for all categories. Delete an existing budget to add a new one.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}