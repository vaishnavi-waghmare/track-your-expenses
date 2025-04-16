import { useState, useEffect } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpenseChart } from './components/ExpenseChart';
import { CategoryPieChart } from './components/CategoryPieChart';
import { DashboardSummary } from './components/DashboardSummary';
import { BudgetForm } from './components/BudgetForm';
import { BudgetComparison } from './components/BudgetComparison';
import { SpendingInsights } from './components/SpendingInsights';
import { ThemeToggle } from './components/ThemeToggle';
import type { Transaction, TransactionFormData, Budget, BudgetFormData } from './types';
import { Wallet, MenuIcon, X, BarChart2, List, ArrowUpCircle, ArrowDownCircle, CreditCard } from 'lucide-react';

// Helper function to load data from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading data from localStorage: ${error}`);
    return defaultValue;
  }
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromLocalStorage('transactions', [])
  );
  
  const [budgets, setBudgets] = useState<Budget[]>(() => 
    loadFromLocalStorage('budgets', [])
  );
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'insights'>('transactions');

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddTransaction = (data: TransactionFormData) => {
    if (editingTransaction) {
      // Edit existing transaction
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? {
          ...t,
          amount: data.category === 'Income' 
            ? Math.abs(Number(data.amount))
            : -Math.abs(Number(data.amount)),
          description: data.description,
          date: data.date,
          category: data.category
        } : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
    } else {
      // Add new transaction
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: Number(data.amount),
      description: data.description,
      date: data.date,
      category: data.category
    };
    setTransactions([...transactions, newTransaction]);
    }
  };

  const handleEditTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setSidebarOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddBudget = (data: BudgetFormData) => {
    const newBudget: Budget = {
      category: data.category,
      amount: Number(data.amount)
    };
    setBudgets([...budgets, newBudget]);
  };

  const handleDeleteBudget = (category: string) => {
    setBudgets(budgets.filter((b) => b.category !== category));
  };

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left section: Menu button and logo for mobile, just logo for desktop */}
            <div className="flex items-center">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button 
                  className="md:hidden mr-2 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
                
                {/* Logo */}
                <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded-full">
                  <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ExpenseTracker</h1>
              </div>
            </div>
            
            {/* Center section: Financial summary cards (desktop only) */}
            <div className="hidden md:flex space-x-6">
              <div className="text-center bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 px-5 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-slate-400 dark:text-slate-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Balance</p>
                </div>
                <p className={`text-lg font-semibold ${totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  ₹{totalBalance.toFixed(2)}
                </p>
              </div>
              <div className="text-center bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 px-5 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ArrowUpCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Income</p>
                </div>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">₹{totalIncome.toFixed(2)}</p>
              </div>
              <div className="text-center bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 px-5 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ArrowDownCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expenses</p>
                </div>
                <p className="text-lg font-semibold text-red-500 dark:text-red-400">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>

            {/* Right section: Theme toggle and balance for mobile */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle (both mobile and desktop) */}
              <ThemeToggle />
              
              {/* Balance card (mobile only) */}
              <div className="md:hidden">
                <div className="bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Balance</p>
                  <p className={`text-base font-semibold ${totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    ₹{totalBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile */}
        <div className={`
          fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out
          ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className="absolute inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className={`fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New</h2>
              <button 
                className="rounded-full w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-colors focus:outline-none"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <TransactionForm 
                  onSubmit={handleAddTransaction} 
                  editTransaction={editingTransaction} 
                  onCancelEdit={handleCancelEdit}
                />
                <BudgetForm 
                  onSubmit={handleAddBudget}
                  existingCategories={budgets.map(b => b.category)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-80 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-inner transition-colors duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New</h2>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto p-4">
              <div className="space-y-6">
                <TransactionForm 
                  onSubmit={handleAddTransaction} 
                  editTransaction={editingTransaction} 
                  onCancelEdit={handleCancelEdit}
                />
              <BudgetForm 
                onSubmit={handleAddBudget}
                existingCategories={budgets.map(b => b.category)}
              />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Cards for Mobile */}
            <div className="md:hidden grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ArrowUpCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Income</p>
                </div>
                <p className="text-base font-semibold text-green-600 dark:text-green-400">₹{totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ArrowDownCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expenses</p>
                </div>
                <p className="text-base font-semibold text-red-500 dark:text-red-400">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-6 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 p-1 w-fit">
              <button 
                className={`px-5 py-2 font-medium text-sm rounded-full transition-all duration-200 flex items-center space-x-2
                  ${activeTab === 'transactions' 
                    ? 'bg-blue-600 text-white dark:bg-blue-700 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'}
                `}
                onClick={() => setActiveTab('transactions')}
              >
                <List className={`h-4 w-4 ${activeTab === 'transactions' ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>Transactions</span>
              </button>
              <button 
                className={`px-5 py-2 font-medium text-sm rounded-full transition-all duration-200 flex items-center space-x-2
                  ${activeTab === 'insights' 
                    ? 'bg-blue-600 text-white dark:bg-blue-700 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'}
                `}
                onClick={() => setActiveTab('insights')}
              >
                <BarChart2 className={`h-4 w-4 ${activeTab === 'insights' ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>Insights</span>
              </button>
            </div>

            {activeTab === 'transactions' ? (
              <div className="space-y-6">
                <DashboardSummary transactions={transactions} />
                <TransactionList
                  transactions={transactions}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <ExpenseChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            {budgets.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <BudgetComparison 
                      budgets={budgets} 
                      transactions={transactions}
                      onDeleteBudget={handleDeleteBudget}
                    />
                <SpendingInsights transactions={transactions} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;