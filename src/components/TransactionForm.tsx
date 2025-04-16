import { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Calendar, Hash, Tag, FileText } from 'lucide-react';
import type { TransactionFormData, TransactionCategory, Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  editTransaction: Transaction | null;
  onCancelEdit: () => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Income',
  'Other'
];

export function TransactionForm({ onSubmit, editTransaction, onCancelEdit }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other'
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: Math.abs(editTransaction.amount).toString(),
        description: editTransaction.description,
        date: editTransaction.date,
        category: editTransaction.category
      });
    }
  }, [editTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.date) return;

    const amount = formData.category === 'Income' 
      ? Math.abs(Number(formData.amount))
      : -Math.abs(Number(formData.amount));

    onSubmit({
      ...formData,
      amount: amount.toString()
    });

    if (!editTransaction) {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Other'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          {editTransaction && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount (₹)
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 dark:text-slate-400 sm:text-sm">₹</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter description"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category} className="dark:bg-slate-700">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-9 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-colors"
          >
            {editTransaction ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Transaction
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Transaction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}