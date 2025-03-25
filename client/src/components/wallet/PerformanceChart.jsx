// src/components/wallet/PerformanceChart.jsx

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PerformanceChart = ({ portfolioData }) => {
 const chartRef = useRef(null);
 const chartInstance = useRef(null);
 
 useEffect(() => {
   if (!portfolioData || !chartRef.current) return;
   
   // Cleanup previous chart if it exists
   if (chartInstance.current) {
     chartInstance.current.destroy();
   }
   
   // Check if we have historical data
   const historicalData = portfolioData.historicalData || {
     timestamps: [],
     values: [],
     apy: []
   };
   
   // If no historical data, create dummy data for display purposes
   let labels = historicalData.timestamps;
   let values = historicalData.values;
   let apy = historicalData.apy;
   
   if (!labels.length) {
     // Generate 30 days of dummy data
     labels = Array.from({ length: 30 }, (_, i) => {
       const date = new Date();
       date.setDate(date.getDate() - (30 - i - 1));
       return date.toISOString().split('T')[0];
     });
     
     // Generate dummy portfolio value data (starting at current value)
     const currentValue = parseFloat(portfolioData.totalValueUSD || 100);
     values = [currentValue * 0.9];
     for (let i = 1; i < 30; i++) {
       const change = ((Math.random() * 0.04) - 0.015); // -1.5% to +2.5%
       values.push(Number((values[i-1] * (1 + change)).toFixed(2)));
     }
     
     // Generate dummy APY data
     apy = Array.from({ length: 30 }, () => (Math.random() * 2 + 7).toFixed(2));
   }
   
   const ctx = chartRef.current.getContext('2d');
   
   // Create chart
   chartInstance.current = new Chart(ctx, {
     type: 'line',
     data: {
       labels,
       datasets: [
         {
           label: 'Portfolio Value ($)',
           data: values,
           borderColor: '#3b82f6', // blue-500
           backgroundColor: 'rgba(59, 130, 246, 0.1)',
           tension: 0.3,
           fill: true,
           yAxisID: 'y'
         },
         {
           label: 'APY (%)',
           data: apy,
           borderColor: '#10b981', // green-500
           backgroundColor: 'transparent',
           borderDash: [5, 5],
           tension: 0.3,
           yAxisID: 'y1'
         }
       ]
     },
     options: {
       responsive: true,
       maintainAspectRatio: false,
       interaction: {
         mode: 'index',
         intersect: false,
       },
       plugins: {
         legend: {
           position: 'top',
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
               if (context.datasetIndex === 0) {
                 return `Value: $${context.raw.toLocaleString()}`;
               } else {
                 return `APY: ${context.raw}%`;
               }
             }
           }
         }
       },
       scales: {
         x: {
           grid: {
             color: 'rgba(255, 255, 255, 0.1)'
           },
           ticks: {
             color: 'rgba(255, 255, 255, 0.7)'
           }
         },
         y: {
           type: 'linear',
           display: true,
           position: 'left',
           title: {
             display: true,
             text: 'Portfolio Value ($)',
             color: 'rgba(255, 255, 255, 0.7)'
           },
           grid: {
             color: 'rgba(255, 255, 255, 0.1)'
           },
           ticks: {
             color: 'rgba(255, 255, 255, 0.7)'
           }
         },
         y1: {
           type: 'linear',
           display: true,
           position: 'right',
           grid: {
             drawOnChartArea: false
           },
           title: {
             display: true,
             text: 'APY (%)',
             color: 'rgba(255, 255, 255, 0.7)'
           },
           ticks: {
             color: 'rgba(255, 255, 255, 0.7)',
             callback: function(value) {
               return value + '%';
             }
           }
         }
       }
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
     <h3 className="text-lg font-semibold text-white mb-4">Performance History</h3>
     <div className="relative h-80">
       <canvas ref={chartRef} id="performance-chart"></canvas>
     </div>
     <div className="mt-4 grid grid-cols-3 gap-4 text-center">
       <div>
         <p className="text-sm text-gray-400">Daily Change</p>
         <p className={`text-lg font-bold ${parseFloat(portfolioData?.performance?.dailyChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
           {parseFloat(portfolioData?.performance?.dailyChange || 0) >= 0 ? '+' : ''}{portfolioData?.performance?.dailyChange || '0.00'}%
         </p>
       </div>
       <div>
         <p className="text-sm text-gray-400">Weekly Change</p>
         <p className={`text-lg font-bold ${parseFloat(portfolioData?.performance?.weeklyChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
           {parseFloat(portfolioData?.performance?.weeklyChange || 0) >= 0 ? '+' : ''}{portfolioData?.performance?.weeklyChange || '0.00'}%
         </p>
       </div>
       <div>
         <p className="text-sm text-gray-400">Monthly Change</p>
         <p className={`text-lg font-bold ${parseFloat(portfolioData?.performance?.monthlyChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
           {parseFloat(portfolioData?.performance?.monthlyChange || 0) >= 0 ? '+' : ''}{portfolioData?.performance?.monthlyChange || '0.00'}%
         </p>
       </div>
     </div>
   </div>
 );
};

export default PerformanceChart;