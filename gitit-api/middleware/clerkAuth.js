const { clerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

module.exports = (req, res, next) =>{
    // clerk not setup yet in front end
    next();
}
