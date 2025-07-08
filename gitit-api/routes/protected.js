const express = require('express');
const hybridAuth = require('../middleware/hybridAuth');
const router = express.Router();

router.get('/protected', hybridAuth, (req, res) => {
    const userId = req.auth?.userId || req.user?.userId;

    if (!userId) return res.status(401).send('Unauthorized');

    if (req.user?.role !== 'ADMIN') {
        return res.status(403).send('Forbidden - Admin access required');
    }

    res.send(`Hello admin user: ${userId}`);
  
});

module.exports = router;
