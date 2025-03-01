import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import PriceChart from '../components/portfolio/PriceChart';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated();
  const { user, loading } = auth;
  const router = useRouter();
  
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    const getPortfolios = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/portfolios');
        setPortfolios(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load portfolios');
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      getPortfolios();
    }
  }, [isAuthenticated]);
  
  const handleUpdatePrices = async (portfolioId) => {
    try {
      setIsLoading(true);
      await api.post(`/api/portfolios/${portfolioId}/update-prices`);
      const response = await api.get('/api/portfolios');
      setPortfolios(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to update prices');
      setIsLoading(false);
    }
  };
  
  // Calculate total portfolio value
  const totalValue = portfolios.reduce((sum, portfolio) => sum + portfolio.totalCurrentValue, 0);
  const totalInvested = portfolios.reduce((sum, portfolio) => sum + portfolio.totalInvestedValue, 0);
  const totalProfit = totalValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          {isLoading ? (
            <div className="text-center py-10">Loading portfolios...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-600">Total Value</h3>
                    <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                </Card>
                
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-600">Total Invested</h3>
                    <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                  </div>
                </Card>
                
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-600">Profit/Loss</h3>
                    <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalProfit)} ({profitPercentage.toFixed(2)}%)
                    </p>
                  </div>
                </Card>
              </div>
              
              {portfolios.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl mb-4">You don't have any portfolios yet.</p>
                  <button 
                    onClick={() => router.push('/portfolio')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Create Portfolio
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
                    <PortfolioSummary portfolios={portfolios} onUpdatePrices={handleUpdatePrices} />
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Performance Chart</h2>
                    <Card>
                      <div className="p-6 h-80">
                        <PriceChart portfolios={portfolios} />
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}