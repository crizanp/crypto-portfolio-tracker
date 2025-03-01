import { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const AssetsList = ({ portfolio, onDeleteAsset, onEditAsset, onRefreshPrices }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'ascending' });

  const handleDeleteClick = (asset) => {
    setAssetToDelete(asset);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (assetToDelete) {
      onDeleteAsset(assetToDelete._id);
      setShowDeleteModal(false);
      setAssetToDelete(null);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = [...(portfolio?.assets || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const getClassNameForValue = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return '';
  };

  return (
    <div className="assets-list">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Assets</h2>
        <div className="flex space-x-2">
          <Button onClick={onRefreshPrices} variant="outlined">
            Refresh Prices
          </Button>
        </div>
      </div>

      {sortedAssets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No assets in this portfolio yet.</p>
          <p className="mt-2">Add your first asset to start tracking your investments.</p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th onClick={() => requestSort('symbol')} className="cursor-pointer">
                Symbol {sortConfig.key === 'symbol' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('name')} className="cursor-pointer">
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('wallet')} className="cursor-pointer">
                Wallet {sortConfig.key === 'wallet' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('quantity')} className="cursor-pointer">
                Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('buyPrice')} className="cursor-pointer">
                Buy Price {sortConfig.key === 'buyPrice' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('currentPrice')} className="cursor-pointer">
                Current Price {sortConfig.key === 'currentPrice' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('totalInvested')} className="cursor-pointer">
                Total Invested {sortConfig.key === 'totalInvested' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('currentValue')} className="cursor-pointer">
                Current Value {sortConfig.key === 'currentValue' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('profit')} className="cursor-pointer">
                Profit/Loss {sortConfig.key === 'profit' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset) => {
              const totalInvested = asset.quantity * asset.buyPrice;
              const currentValue = asset.quantity * asset.currentPrice;
              const profit = currentValue - totalInvested;
              const profitPercentage = (profit / totalInvested) * 100;

              return (
                <tr key={asset._id}>
                  <td className="font-medium">{asset.symbol}</td>
                  <td>{asset.name}</td>
                  <td>{asset.wallet}</td>
                  <td className="text-right">{asset.quantity.toLocaleString()}</td>
                  <td className="text-right">{formatCurrency(asset.buyPrice)}</td>
                  <td className="text-right">{formatCurrency(asset.currentPrice)}</td>
                  <td className="text-right">{formatCurrency(totalInvested)}</td>
                  <td className="text-right">{formatCurrency(currentValue)}</td>
                  <td className={`text-right ${getClassNameForValue(profit)}`}>
                    {formatCurrency(profit)} ({formatPercentage(profitPercentage)})
                  </td>
                  <td>
                    <div className="flex space-x-1">
                      <Button size="small" onClick={() => onEditAsset(asset)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDeleteClick(asset)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Asset"
      >
        <p>Are you sure you want to delete {assetToDelete?.symbol}?</p>
        <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AssetsList;
