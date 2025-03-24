const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = 'your-secret-key'; // Same secret as in authController

const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from token
    const user = userModel.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    // Add user to request
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };