import dbConnect from '../../../lib/dbConnect';
import Portfolio from '../../../models/Portfolio';
import authenticate from '../../../middleware/authenticate';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, assets, targetAmount, currency } = req.body;
    
    // Create new portfolio
    const portfolio = await Portfolio.create({
      user: req.user._id,
      name,
      assets,
      targetAmount,
      currency,
    });
    
    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Add portfolio error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// Wrap handler with authentication middleware
export default async function(req, res) {
  return authenticate(req, res, () => handler(req, res));
}