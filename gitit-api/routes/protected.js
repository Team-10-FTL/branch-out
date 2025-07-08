const express = require('express');
const hybridAuth = require('../middleware/hybridAuth');
const router = express.Router();

router.get('/protected', hybridAuth, (req, res) => {
  if (req.auth?.userId) {
    res.send(`Hello Clerk user: ${req.auth.userId}`);
  } else if (req.user?.userId) {
    res.send(`Hello local user: ${req.user.userId}`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
