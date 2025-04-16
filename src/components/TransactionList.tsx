import { format } from 'date-fns';
import { Trash2, Edit, Search, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';
import type { Transaction } from '../types';
import { useStaggeredAnimation } from '../utils/animations';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction, onEditTransaction }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Use staggered animation for transaction rows
  const visibleItems = useStaggeredAnimation(sortedTransactions.length);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Transactions</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {transactions.length} total transactions
          </p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>
      
      {sortedTransactions.length > 0 ? (
        <div className="overflow-x-auto max-w-full scrollbar-thin">
          <table className="w-full divide-y divide-slate-200 dark:divide-slate-700 table-fixed">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[90px] sm:w-[120px]">
                  Date
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell w-[120px]">
                  Category
                </th>
                <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[90px] sm:w-[100px]">
                  Amount
                </th>
                <th scope="col" className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[60px] sm:w-[90px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {sortedTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 ${
                    visibleItems[index] 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-800 dark:text-white font-medium">
                    <div className="truncate max-w-[120px] sm:max-w-none">{transaction.description}</div>
                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400 md:hidden mt-1 truncate">{transaction.category}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right">
                    <div className="flex items-center justify-end">
                      {transaction.amount < 0 ? 
                        <ArrowDownCircle className="h-3.5 w-3.5 mr-1 text-red-500 dark:text-red-400 flex-shrink-0" /> : 
                        <ArrowUpCircle className="h-3.5 w-3.5 mr-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                      }
                      <span 
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold flex-shrink-0 ${
                          transaction.amount < 0 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      <button
                        onClick={() => onEditTransaction(transaction.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 sm:p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                        aria-label="Edit transaction"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 sm:p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <Search className="h-7 w-7 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No transactions found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {searchTerm ? 'Try a different search term' : 'Add your first transaction to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
