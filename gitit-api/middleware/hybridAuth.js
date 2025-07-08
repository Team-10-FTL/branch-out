const clerkAuth = require('./clerkAuth');
const requireLocalAuth = require('./requireLocalAuth');

function hybridAuth(req, res, next) {
//   clerkAuth(req, res, (err) => {
//     if (req.auth?.userId) {
//       return next();
//     }

    requireLocalAuth(req, res, (err) => {
      if (req.user) {
        return next();
      }
      res.status(401).send('Unauthorized');
    });
//   });
}

module.exports = hybridAuth;
