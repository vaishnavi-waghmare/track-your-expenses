import { AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';
import type { Transaction } from '../types';

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export function SpendingInsights({ transactions }: SpendingInsightsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const actualSpending = monthlyTransactions.reduce((acc: Record<string, number>, t) => {
    if (t.amount < 0) {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {});

  const insights = Object.entries(actualSpending).map(([category, actual]) => {
    const percentage = actual > 0 ? 100 : 0;
    
    let status: 'good' | 'warning' | 'over' = 'good';
    if (percentage >= 100) {
      status = 'over';
    } else if (percentage >= 80) {
      status = 'warning';
    }

    return {
      category,
      actual,
      percentage,
      status
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Spending Insights</h3>
      </div>
      
      <div className="p-5 space-y-4">
        {insights.length > 0 ? (
          insights.map(insight => (
            <div key={insight.category} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800 dark:text-slate-200">{insight.category}</span>
                <div className="flex items-center">
                  {insight.status === 'over' && (
                    <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
                  )}
                  {insight.status === 'warning' && (
                    <TrendingDown className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-2" />
                  )}
                  {insight.status === 'good' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mr-2" />
                  )}
                  <span className={`font-semibold ${
                    insight.status === 'over' ? 'text-red-600 dark:text-red-400' :
                    insight.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    ₹{insight.actual.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    insight.status === 'over' ? 'bg-red-500 dark:bg-red-500' :
                    insight.status === 'warning' ? 'bg-amber-500 dark:bg-amber-500' :
                    'bg-emerald-500 dark:bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, insight.percentage)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">No spending data for current month</p>
          </div>
        )}
      </div>
    </div>
  );
}
