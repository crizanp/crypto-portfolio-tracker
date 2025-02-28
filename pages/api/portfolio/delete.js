// /pages/api/portfolio/delete.js
import dbConnect from '../../../lib/dbConnect';
import Portfolio from '../../../models/Portfolio';
import authenticate from '../../../middleware/authenticate';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // Find portfolio by ID and check if user owns it
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    
    // Check if user owns the portfolio
    if (portfolio.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this portfolio' });
    }
    
    // Delete portfolio
    await portfolio.remove();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// Wrap handler with authentication middleware
export default async function(req, res) {
  return authenticate(req, res, () => handler(req, res));
}
