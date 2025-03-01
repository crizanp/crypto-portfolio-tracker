import { useState } from 'react';
import Card from '../ui/Card';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PortfolioSummary = ({ portfolio }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!portfolio || !portfolio.assets) {
    return (
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
          <p className="text-gray-500">No portfolio data available</p>
        </div>
      </Card>
    );
  }

  const totalInvestedValue = portfolio.totalInvestedValue || 
    portfolio.assets.reduce((sum, asset) => sum + (asset.quantity * asset.buyPrice), 0);
  
  const totalCurrentValue = portfolio.totalCurrentValue || 
    portfolio.assets.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
  
  const totalProfit = totalCurrentValue - totalInvestedValue;
  const profitPercentage = totalInvestedValue ? (totalProfit / totalInvestedValue) * 100 : 0;
  
  const bestPerformer = portfolio.assets.length > 0 ? 
    [...portfolio.assets].sort((a, b) => {
      const aProfit = (a.currentPrice - a.buyPrice) / a.buyPrice;
      const bProfit = (b.currentPrice - b.buyPrice) / b.buyPrice;
      return bProfit - aProfit;
    })[0] : null;
  
  const worstPerformer = portfolio.assets.length > 0 ? 
    [...portfolio.assets].sort((a, b) => {
      const aProfit = (a.currentPrice - a.buyPrice) / a.buyPrice;
      const bProfit = (b.currentPrice - b.buyPrice) / b.buyPrice;
      return aProfit - bProfit;
    })[0] : null;

  const getProfitClass = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const targetProgress = portfolio.targetAmount ? 
    (totalCurrentValue / portfolio.targetAmount) * 100 : 0;

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{portfolio.name || 'Portfolio Summary'}</h2>
          <button 
            onClick={() => setShowDetails(!showDetails)} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Total Invested</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInvestedValue)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Current Value</div>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Profit/Loss</div>
            <div className={`text-2xl font-bold ${getProfitClass(totalProfit)}`}>
              {formatCurrency(totalProfit)} ({formatPercentage(profitPercentage)})
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Number of Assets</div>
                <div className="text-xl font-medium">{portfolio.assets.length}</div>
              </div>
              
              {portfolio.targetAmount > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Target Progress</div>
                  <div className="text-xl font-medium">
                    {formatPercentage(targetProgress)} of {formatCurrency(portfolio.targetAmount)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(targetProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {bestPerformer && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Best Performer</div>
                  <div className="text-xl font-medium">{bestPerformer.symbol}</div>
                  <div className="text-sm text-green-600">
                    {formatPercentage(((bestPerformer.currentPrice - bestPerformer.buyPrice) / bestPerformer.buyPrice) * 100)}
                  </div>
                </div>
              )}
              
              {worstPerformer && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Worst Performer</div>
                  <div className="text-xl font-medium">{worstPerformer.symbol}</div>
                  <div className="text-sm text-red-600">
                    {formatPercentage(((worstPerformer.currentPrice - worstPerformer.buyPrice) / worstPerformer.buyPrice) * 100)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(portfolio.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PortfolioSummary;
