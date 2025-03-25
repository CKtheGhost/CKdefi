// src/components/wallet/AllocationChart.jsx

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AllocationChart = ({ portfolioData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!portfolioData || !chartRef.current) return;
    
    // Cleanup previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for chart
    const allocation = [];
    const labels = [];
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // green-500
      '#8b5cf6', // purple-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#ec4899', // pink-500
    ];
    
    // Add native APT
    if (portfolioData.apt && parseFloat(portfolioData.apt.amount) > 0) {
      allocation.push(parseFloat(portfolioData.apt.valueUSD));
      labels.push('Native APT');
    }
    
    // Add staked tokens
    if (portfolioData.stAPT && parseFloat(portfolioData.stAPT.amount) > 0) {
      allocation.push(parseFloat(portfolioData.stAPT.valueUSD));
      labels.push('Amnis stAPT');
    }
    
    if (portfolioData.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0) {
      allocation.push(parseFloat(portfolioData.sthAPT.valueUSD));
      labels.push('Thala sthAPT');
    }
    
    if (portfolioData.tAPT && parseFloat(portfolioData.tAPT.amount) > 0) {
      allocation.push(parseFloat(portfolioData.tAPT.valueUSD));
      labels.push('Tortuga tAPT');
    }
    
    if (portfolioData.dAPT && parseFloat(portfolioData.dAPT.amount) > 0) {
      allocation.push(parseFloat(portfolioData.dAPT.valueUSD));
      labels.push('Ditto dAPT');
    }
    
    // Add AMM liquidity
    if (portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity) {
      if (portfolioData.ammLiquidity.positions && portfolioData.ammLiquidity.positions.length > 0) {
        // Add each liquidity position
        portfolioData.ammLiquidity.positions.forEach(position => {
          allocation.push(parseFloat(position.valueUSD));
          labels.push(`${position.protocol} Liquidity`);
        });
      } else {
        // Add total liquidity if positions not detailed
        allocation.push(parseFloat(portfolioData.ammLiquidity.estimatedValueUSD));
        labels.push('AMM Liquidity');
      }
    }
    
    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: allocation,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#1f2937' // gray-800
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12
              },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [portfolioData]);
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Portfolio Allocation</h3>
      <div className="relative h-80">
        {portfolioData && Object.keys(portfolioData).length > 0 ? (
          <canvas ref={chartRef} id="allocation-chart"></canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">No portfolio data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationChart;