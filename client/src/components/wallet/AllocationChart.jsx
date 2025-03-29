import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm">Amount: {parseFloat(data.value).toFixed(2)} APT</p>
        <p className="text-sm">Value: ${parseFloat(data.valueUSD).toFixed(2)}</p>
        <p className="text-sm">Allocation: {data.percentage.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const AllocationChart = ({ className = "" }) => {
  const { portfolio, isLoading } = usePortfolio();

  const chartData = useMemo(() => {
    if (!portfolio || !portfolio.totalValueUSD) return [];

    const allocationData = [];
    const totalValue = parseFloat(portfolio.totalValueUSD);

    // Native APT
    if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
      const valueUSD = parseFloat(portfolio.apt.valueUSD);
      allocationData.push({
        name: 'Native APT',
        value: parseFloat(portfolio.apt.amount),
        valueUSD,
        percentage: (valueUSD / totalValue) * 100,
        type: 'native'
      });
    }

    // Staked positions
    ['stAPT', 'sthAPT', 'tAPT', 'dAPT'].forEach(token => {
      if (portfolio[token] && parseFloat(portfolio[token].amount) > 0) {
        const valueUSD = parseFloat(portfolio[token].valueUSD);
        allocationData.push({
          name: token,
          value: parseFloat(portfolio[token].amount),
          valueUSD,
          percentage: (valueUSD / totalValue) * 100,
          type: 'staked'
        });
      }
    });

    // Liquidity positions
    if (portfolio.ammLiquidity && portfolio.ammLiquidity.hasLiquidity) {
      const valueUSD = parseFloat(portfolio.ammLiquidity.estimatedValueUSD);
      allocationData.push({
        name: 'AMM Liquidity',
        value: 0, // No direct APT amount for liquidity
        valueUSD,
        percentage: (valueUSD / totalValue) * 100,
        type: 'liquidity'
      });
    }

    return allocationData;
  }, [portfolio]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-pulse text-gray-400">Loading allocation data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No allocation data available</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Connect your wallet to see your portfolio allocation</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="font-semibold text-lg mb-4">Portfolio Allocation</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valueUSD"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm">{item.name}: {item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationChart;