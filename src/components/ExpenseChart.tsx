import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { Transaction } from '../types';
import { useTheme } from '../ThemeContext';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const { isDarkMode } = useTheme();
  
  const monthlyData = transactions.reduce((acc: Record<string, number>, transaction) => {
    const month = format(new Date(transaction.date), 'MMM yyyy');
    
    // Only count expenses (negative amounts)
    if (transaction.amount < 0) {
      acc[month] = (acc[month] || 0) + Math.abs(transaction.amount);
    }
    
    return acc;
  }, {});

  const data = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month,
      amount,
      // Add a date object for proper sorting
      date: new Date(month)
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-6) // Show only the last 6 months
    .map(({ month, amount }) => ({ month, amount })); // Remove the date property used for sorting

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Expenses</h3>
      </div>
      
      {data.length > 0 ? (
        <div className="p-5">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDarkMode ? "#4F46E5" : "#3B82F6"} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={isDarkMode ? "#6366F1" : "#60A5FA"} stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={{ stroke: isDarkMode ? "#475569" : "#e2e8f0" }}
                  tickLine={{ stroke: isDarkMode ? "#475569" : "#e2e8f0" }}
                  tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={{ stroke: isDarkMode ? "#475569" : "#e2e8f0" }}
                  tickLine={{ stroke: isDarkMode ? "#475569" : "#e2e8f0" }}
                  tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Expenses']}
                  contentStyle={{ 
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    padding: '8px 12px',
                    color: isDarkMode ? '#e2e8f0' : 'inherit'
                  }}
                  cursor={{ fill: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(96, 165, 250, 0.1)' }}
                  animationDuration={300}
                  labelStyle={{ color: isDarkMode ? '#e2e8f0' : 'inherit' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No expense data available</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Add transactions to visualize your monthly spending</p>
        </div>
      )}
    </div>
  );
}