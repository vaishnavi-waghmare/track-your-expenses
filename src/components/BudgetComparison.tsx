import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react';
import type { Budget, Transaction } from '../types';
import { useTheme } from '../ThemeContext';

interface BudgetComparisonProps {
  budgets: Budget[];
  transactions: Transaction[];
  onDeleteBudget: (category: string) => void;
}

export function BudgetComparison({ budgets, transactions, onDeleteBudget }: BudgetComparisonProps) {
  const { isDarkMode } = useTheme();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter transactions for current month
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate actual spending by category
  const actualSpending = monthlyTransactions.reduce((acc: Record<string, number>, t) => {
    if (t.amount < 0) { // Only consider expenses
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {});

  const data = budgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    actual: actualSpending[budget.category] || 0,
    remaining: Math.max(0, budget.amount - (actualSpending[budget.category] || 0))
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Budget vs Actual Spending</h3>
      </div>
      
      <div className="p-5">
        {budgets.length > 0 ? (
          <>
            <div className="mb-4">
              <div className="max-h-[150px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {budgets.map((budget) => (
                      <tr key={budget.category} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">{budget.category}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-slate-900 dark:text-slate-200">₹{budget.amount.toFixed(2)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => onDeleteBudget(budget.category)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                    axisLine={{ stroke: isDarkMode ? '#334155' : '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                    axisLine={{ stroke: isDarkMode ? '#334155' : '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a'
                    }}
                  />
                  <Legend wrapperStyle={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }} />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                  <Bar dataKey="actual" fill="#EF4444" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">No budgets set yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}