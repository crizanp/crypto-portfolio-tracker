import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PriceChart = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState('7d');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolio?.assets?.length > 0) {
      generateChartData();
    }
  }, [portfolio, timeframe]);

  const generateChartData = () => {
    // In a real app, you'd fetch historical price data from an API
    // For this example, we'll generate mock data
    setLoading(true);
    
    // Sort assets by value
    const topAssets = [...portfolio.assets]
      .sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice))
      .slice(0, 5);  // Get top 5 assets
    
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    
    // Generate mock data for each asset
    const data = topAssets.map(asset => {
      const dataPoints = [];
      const volatility = Math.random() * 0.1 + 0.02;  // Random volatility between 2-12%
      let currentPrice = asset.currentPrice;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate a random price movement
        if (i !== 0) {  // Keep the last price as the actual current price
          const change = (Math.random() - 0.5) * volatility;
          currentPrice = currentPrice * (1 + change);
        } else {
          currentPrice = asset.currentPrice;
        }
        
        dataPoints.push({
          date: date.toISOString().split('T')[0],
          price: currentPrice,
          value: currentPrice * asset.quantity
        });
      }
      
      return {
        asset: asset.symbol,
        data: dataPoints
      };
    });
    
    setChartData(data);
    setLoading(false);
  };

  if (!portfolio || portfolio.assets.length === 0) {
    return (
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>
          <p className="text-gray-500">Add assets to view performance charts</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Portfolio Performance</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 text-sm rounded ${
                timeframe === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 text-sm rounded ${
                timeframe === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 py-1 text-sm rounded ${
                timeframe === '90d' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              90D
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Loading chart data...</p>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would be displayed here</p>
            <p className="text-sm text-gray-400">
              (In a real implementation, use a charting library like recharts or Chart.js)
            </p>
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-medium mb-2">Top Assets</h3>
          <div className="space-y-2">
            {chartData.map(item => {
              const asset = portfolio.assets.find(a => a.symbol === item.asset);
              if (!asset) return null;
              
              const firstPrice = item.data[0].price;
              const lastPrice = item.data[item.data.length - 1].price;
              const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
              
              return (
                <div key={asset.symbol} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-blue-600 rounded-sm mr-2"></div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-gray-500">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(asset.currentPrice)}</div>
                    <div className={percentChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(percentChange)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;