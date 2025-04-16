import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Text, Sector } from 'recharts';
import { useState } from 'react';
import type { Transaction, CategorySummary } from '../types';
import { useTheme } from '../ThemeContext';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#4F46E5', '#F43F5E', '#10B981', '#F59E0B', '#8B5CF6', 
  '#EC4899', '#0EA5E9', '#84CC16', '#D946EF', '#6366F1',
];

const CenterLabel = ({ viewBox, value }: { viewBox?: any, value: string }) => {
  const { isDarkMode } = useTheme();
  const { cx, cy } = viewBox;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={58}
        fill={isDarkMode ? '#1e293b' : '#f8fafc'}
        stroke={isDarkMode ? '#334155' : '#e2e8f0'}
        strokeWidth={1.5}
        filter="url(#centerShadow)"
      />
      <Text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className="recharts-text recharts-center-label"
        style={{
          fontSize: '15px',
          fill: isDarkMode ? '#94a3b8' : '#64748b',
          fontWeight: '500',
        }}
      >
        Total Expenses
      </Text>
      <Text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        className="recharts-text recharts-center-label"
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          fill: isDarkMode ? '#f1f5f9' : '#1e293b',
        }}
      >
        {value}
      </Text>
    </>
  );
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
        opacity={0.9}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 6}
        outerRadius={innerRadius - 2}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const { isDarkMode } = useTheme();

  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const formattedTotal = `₹${totalExpenses.toFixed(2)}`;

  const data: CategorySummary[] = Object.entries(expensesByCategory).map(([category, total]) => ({
    category: category as Transaction['category'],
    total,
    percentage: (total / totalExpenses) * 100
  }));

  const sortedData = [...data].sort((a, b) => b.total - a.total);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Expenses by Category</h3>
      </div>
      
      {sortedData.length > 0 ? (
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-6">
            {sortedData.map((entry, index) => (
              <div 
                key={entry.category}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out"
                style={{ 
                  backgroundColor: `${COLORS[index % COLORS.length]}${isDarkMode ? '30' : '15'}`,
                  color: COLORS[index % COLORS.length],
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeIndex === index ? '0 2px 5px rgba(0,0,0,0.15)' : 'none'
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <span 
                  className="mr-1.5 h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {entry.category}: {entry.percentage.toFixed(0)}%
              </div>
            ))}
          </div>
          
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <filter id="centerShadow" height="200%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={isDarkMode ? "#1e293b" : "#94a3b8"} floodOpacity="0.2"/>
                  </filter>
                  
                  {COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={sortedData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={70}
                  paddingAngle={4}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={900}
                  animationBegin={0}
                  animationEasing="ease-out"
                  cornerRadius={5}
                >
                  {sortedData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index % COLORS.length})`} 
                      stroke={isDarkMode ? "#1e293b" : "#fff"}
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, _: string, props: any) => {
                    return [`₹${value.toFixed(2)} (${props.payload.percentage.toFixed(1)}%)`, props.payload.category];
                  }}
                  contentStyle={{ 
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    padding: '8px 12px',
                    color: isDarkMode ? '#f1f5f9' : '#0f172a'
                  }}
                  itemStyle={{
                    padding: '4px 0',
                    color: isDarkMode ? '#f1f5f9' : 'inherit'
                  }}
                  animationDuration={300}
                  labelStyle={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}
                />
                {totalExpenses > 0 && <CenterLabel viewBox={{ cx: "50%", cy: "50%" }} value={formattedTotal} />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">No expense data available</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Add transactions to see category breakdown</p>
        </div>
      )}
    </div>
  );
}