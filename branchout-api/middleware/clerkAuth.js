const { clerkClient } = require('@clerk/clerk-sdk-node');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(); // Continue to local auth
    }
    
    const session = await clerkClient.sessions.verifySession(token);
    req.auth = { userId: session.userId };
    next();
    
  } catch (error) {
    next(); // If Clerk fails, try local auth
  }
};