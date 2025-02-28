import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';
import AssetsList from '../components/portfolio/AssetsList';
import AddAssetForm from '../components/portfolio/AddAssetForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { fetchPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from '../utils/api';

export default function Portfolio() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 0,
    currency: 'USD'
  });
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    const getPortfolios = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPortfolios();
        setPortfolios(data);
        if (data.length > 0) {
          setSelectedPortfolio(data[0]);
        }
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const newPortfolio = await addPortfolio(formData);
      setPortfolios([...portfolios, newPortfolio]);
      setSelectedPortfolio(newPortfolio);
      setShowAddModal(false);
      setFormData({ name: '', targetAmount: 0, currency: 'USD' });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to add portfolio');
      setIsLoading(false);
    }
  };
  
  const handleEditPortfolio = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updatedPortfolio = await updatePortfolio(selectedPortfolio._id, formData);
      setPortfolios(portfolios.map(p => p._id === updatedPortfolio._id ? updatedPortfolio : p));
      setSelectedPortfolio(updatedPortfolio);
      setShowEditModal(false);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to update portfolio');
      setIsLoading(false);
    }
  };
  
  const handleDeletePortfolio = async () => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    try {
      setIsLoading(true);
      await deletePortfolio(selectedPortfolio._id);
      const updatedPortfolios = portfolios.filter(p => p._id !== selectedPortfolio._id);
      setPortfolios(updatedPortfolios);
      if (updatedPortfolios.length > 0) {
        setSelectedPortfolio(updatedPortfolios[0]);
      } else {
        setSelectedPortfolio(null);
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to delete portfolio');
      setIsLoading(false);
    }
  };
  
  const handleOpenEditModal = () => {
    setFormData({
      name: selectedPortfolio.name,
      targetAmount: selectedPortfolio.targetAmount,
      currency: selectedPortfolio.currency
    });
    setShowEditModal(true);
  };
  
  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Portfolios</h1>
            <Button onClick={() => setShowAddModal(true)} primary>
              Add Portfolio
            </Button>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          {isLoading ? (
            <div className="text-center py-10">Loading portfolios...</div>
          ) : (
            <>
              {portfolios.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl mb-4">You don't have any portfolios yet.</p>
                  <Button onClick={() => setShowAddModal(true)} primary>
                    Create Portfolio
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Select Portfolio:</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedPortfolio?._id || ''}
                      onChange={(e) => {
                        const portfolio = portfolios.find(p => p._id === e.target.value);
                        setSelectedPortfolio(portfolio);
                      }}
                    >
                      {portfolios.map(portfolio => (
                        <option key={portfolio._id} value={portfolio._id}>
                          {portfolio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedPortfolio && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{selectedPortfolio.name}</h2>
                        <div className="flex space-x-2">
                          <Button onClick={handleOpenEditModal} small>
                            Edit
                          </Button>
                          <Button onClick={handleDeletePortfolio} danger small>
                            Delete
                          </Button>
                          <Button onClick={() => setShowAddAssetModal(true)} primary small>
                            Add Asset
                          </Button>
                        </div>
                      </div>
                      
                      <AssetsList 
                        portfolio={selectedPortfolio} 
                        onUpdate={(updatedPortfolio) => {
                          setPortfolios(portfolios.map(p => 
                            p._id === updatedPortfolio._id ? updatedPortfolio : p
                          ));
                          setSelectedPortfolio(updatedPortfolio);
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Add Portfolio Modal */}
          <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Portfolio">
            <form onSubmit={handleAddPortfolio}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Portfolio Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Target Amount:</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Currency:</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setShowAddModal(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" primary>
                  Add Portfolio
                </Button>
              </div>
            </form>
          </Modal>
          
          {/* Edit Portfolio Modal */}
          <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Portfolio">
            <form onSubmit={handleEditPortfolio}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Portfolio Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Target Amount:</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Currency:</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setShowEditModal(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" primary>
                  Update Portfolio
                </Button>
              </div>
            </form>
          </Modal>
          
          {/* Add Asset Modal */}
          {selectedPortfolio && (
            <Modal isOpen={showAddAssetModal} onClose={() => setShowAddAssetModal(false)} title="Add Asset">
              <AddAssetForm
                portfolioId={selectedPortfolio._id}
                onSuccess={(updatedPortfolio) => {
                  setPortfolios(portfolios.map(p => 
                    p._id === updatedPortfolio._id ? updatedPortfolio : p
                  ));
                  setSelectedPortfolio(updatedPortfolio);
                  setShowAddAssetModal(false);
                }}
                onCancel={() => setShowAddAssetModal(false)}
              />
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
}