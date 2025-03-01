import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AddAssetForm = ({ onAddAsset, assetToEdit, onUpdateAsset, onCancel }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
    wallet: 'Bitget',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        symbol: assetToEdit.symbol,
        name: assetToEdit.name,
        quantity: assetToEdit.quantity.toString(),
        buyPrice: assetToEdit.buyPrice.toString(),
        currentPrice: assetToEdit.currentPrice.toString(),
        wallet: assetToEdit.wallet || 'Bitget',
      });
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [assetToEdit]);

  const resetForm = () => {
    setFormData({
      symbol: '',
      name: '',
      quantity: '',
      buyPrice: '',
      currentPrice: '',
      wallet: 'Bitget',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symbol) newErrors.symbol = 'Symbol is required';
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.buyPrice) {
      newErrors.buyPrice = 'Buy price is required';
    } else if (isNaN(formData.buyPrice) || parseFloat(formData.buyPrice) < 0) {
      newErrors.buyPrice = 'Buy price must be a positive number';
    }
    
    if (formData.currentPrice && (isNaN(formData.currentPrice) || parseFloat(formData.currentPrice) < 0)) {
      newErrors.currentPrice = 'Current price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const assetData = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.currentPrice) || parseFloat(formData.buyPrice),
      wallet: formData.wallet,
    };
    
    try {
      if (isEditing) {
        await onUpdateAsset({ ...assetData, _id: assetToEdit._id });
      } else {
        await onAddAsset(assetData);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Asset' : 'Add New Asset'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              error={errors.symbol}
              disabled={isEditing}
              placeholder="BTC"
            />
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Bitcoin"
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              step="any"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="0.5"
            />
            <Input
              label="Buy Price ($)"
              name="buyPrice"
              type="number"
              step="any"
              value={formData.buyPrice}
              onChange={handleChange}
              error={errors.buyPrice}
              placeholder="30000"
            />
            <Input
              label="Current Price ($)"
              name="currentPrice"
              type="number"
              step="any"
              value={formData.currentPrice}
              onChange={handleChange}
              error={errors.currentPrice}
              placeholder="Leave empty to use buy price"
            />
            <Input
              label="Wallet"
              name="wallet"
              value={formData.wallet}
              onChange={handleChange}
              placeholder="Bitget, Binance, etc."
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {isEditing && (
              <Button type="button" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Asset' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default AddAssetForm;
