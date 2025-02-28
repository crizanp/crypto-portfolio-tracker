import dbConnect from '../../../lib/dbConnect';
import Portfolio from '../../../models/Portfolio';
import authenticate from '../../../middleware/authenticate';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get all portfolios for the user
    const portfolios = await Portfolio.find({ user: req.user._id });
    
    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// Wrap handler with authentication middleware
export default async function(req, res) {
  return authenticate(req, res, () => handler(req, res));
}