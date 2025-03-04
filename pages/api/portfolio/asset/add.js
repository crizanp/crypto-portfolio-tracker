import dbConnect from '../../../../lib/dbConnect';
import Portfolio from '../../../../models/Portfolio';
import authenticate from '../../../../middleware/authenticate';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { portfolioId, asset } = req.body;
    
    // Find portfolio by ID
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this portfolio' });
    }
    
    // Add new asset to portfolio
    portfolio.assets.push(asset);
    
    // Save updated portfolio
    await portfolio.save();
    
    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Add asset error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// Wrap handler with authentication middleware
export default async function(req, res) {
  return authenticate(req, res, () => handler(req, res));
}
