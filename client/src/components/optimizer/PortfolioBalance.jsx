import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const PortfolioBalance = () => {
  const { portfolio, isLoading } = usePortfolio();
  const [allocations, setAllocations] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [dailyChange, setDailyChange] = useState({ value: 0, percentage: 0 });

  // Custom colors for chart
  const COLORS = ['#4f46e5', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#84cc16', '#06b6d4'];

  useEffect(() => {
    if (portfolio) {
      // Format data for the pie chart
      const allocationData = [];
      
      // Add native APT if present
      if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
        allocationData.push({
          name: 'Native APT',
          value: parseFloat(portfolio.apt.valueUSD),
          amount: parseFloat(portfolio.apt.amount)
        });
      }
      
      // Add staked tokens
      const stakedTokens = {
        stAPT: 'Amnis stAPT',
        sthAPT: 'Thala sthAPT',
        tAPT: 'Tortuga tAPT',
        dAPT: 'Ditto dAPT'
      };
      
      Object.entries(stakedTokens).forEach(([key, name]) => {
        if (portfolio[key] && parseFloat(portfolio[key].amount) > 0) {
          allocationData.push({
            name,
            value: parseFloat(portfolio[key].valueUSD),
            amount: parseFloat(portfolio[key].amount)
          });
        }
      });
      
      // Add liquidity positions if any
      if (portfolio.ammLiquidity && portfolio.ammLiquidity.hasLiquidity) {
        allocationData.push({
          name: 'AMM Liquidity',
          value: parseFloat(portfolio.ammLiquidity.estimatedValueUSD),
          amount: null // Amount in tokens not applicable for LP positions
        });
      }
      
      // Calculate total value
      const totalValue = parseFloat(portfolio.totalValueUSD);
      
      // Calculate daily change if available
      let change = { value: 0, percentage: 0 };
      if (portfolio.performanceMetrics && portfolio.performanceMetrics.dailyChange) {
        change = {
          value: totalValue * (portfolio.performanceMetrics.dailyChange / 100),
          percentage: portfolio.performanceMetrics.dailyChange
        };
      }
      
      setAllocations(allocationData);
      setTotalValue(totalValue);
      setDailyChange(change);
    }
  }, [portfolio]);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-lg border dark:border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">${data.value.toFixed(2)} ({((data.value / totalValue) * 100).toFixed(2)}%)</p>
          {data.amount && <p className="text-xs text-gray-500 dark:text-gray-400">Amount: {data.amount.toFixed(6)}</p>}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 h-96 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading portfolio data...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Portfolio Balance</h2>
        <div className="text-right">
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
          <div className={`flex items-center ${dailyChange.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dailyChange.percentage >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              ${Math.abs(dailyChange.value).toFixed(2)} ({Math.abs(dailyChange.percentage).toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {allocations.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No portfolio data available</p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h3 className="font-medium">Allocation Breakdown</h3>
        {allocations.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}</span>
            </div>
            <span>{((item.value / totalValue) * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioBalance;