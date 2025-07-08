const jwt = require('jsonwebtoken');

const requireLocalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).send('Invalid local token');
  }
};

module.exports = requireLocalAuth; 
