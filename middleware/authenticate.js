import jwt from 'jsonwebtoken';
import User from '../models/User';
import dbConnect from '../lib/dbConnect';

export default async function authenticate(req, res, next) {
  try {
    await dbConnect();
    
    let token;
    
    // Check if auth header exists and has Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    
    // Call next middleware
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
}