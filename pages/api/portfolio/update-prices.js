import dbConnect from '../../../lib/dbConnect';
import Portfolio from '../../../models/Portfolio';
import authenticate from '../../../middleware/authenticate';
import axios from 'axios';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { portfolioId } = req.body;
    
    // Find portfolio by ID
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this portfolio' });
    }
    
    // Get unique crypto symbols
    const symbols = [...new Set(portfolio.assets.map(asset => asset.symbol))];
    
    // Fetch current prices using a public API (could be replaced with your preferred crypto API)
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd`
    );
    
    const prices = response.data;
    
    // Update asset prices
    portfolio.assets.forEach(asset => {
      if (prices[asset.symbol.toLowerCase()] && prices[asset.symbol.toLowerCase()].usd) {
        asset.currentPrice = prices[asset.symbol.toLowerCase()].usd;
        asset.lastUpdated = Date.now();
      }
    });
    
    // Save updated portfolio
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Update prices error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// Wrap handler with authentication middleware
export default async function(req, res) {
  return authenticate(req, res, () => handler(req, res));
}
