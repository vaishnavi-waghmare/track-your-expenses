import { TrendingDown, TrendingUp, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '../types';
import { useStaggeredAnimation } from '../utils/animations';

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export function DashboardSummary({ transactions }: DashboardSummaryProps) {
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  // Use staggered animation for transaction items
  const visibleItems = useStaggeredAnimation(recentTransactions.length);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-slide-up">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Activity</h3>
      </div>
      
      {recentTransactions.length > 0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentTransactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 ${
                visibleItems[index] 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                    transaction.amount < 0 
                      ? 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-100 dark:ring-red-800' 
                      : 'bg-green-50 dark:bg-green-900/20 ring-1 ring-green-100 dark:ring-green-800'
                  }`}>
                    {transaction.amount < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{transaction.description}</p>
                    <div className="flex items-center mt-1.5">
                      <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 mr-2">
                        <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Tag className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium px-2.5 py-1 rounded-full transform transition-transform hover:scale-105 ${
                  transaction.amount < 0 
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                }`}>
                  {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Calendar className="h-7 w-7 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No transactions yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Add your first transaction to see it here</p>
        </div>
      )}
    </div>
  );
}