const express = require('express');
const hybridAuth = require('../middleware/hybridAuth');
const router = express.Router();

router.get('/protected', hybridAuth, (req, res) => {
    const userId = req.auth?.userId || req.user?.userId;

    if (!userId) return res.status(401).send('Unauthorized');

    if (req.user?.role !== 'ADMIN') {
        console.log('Role check failed. Expected: ADMIN, Got:', req.user?.role); // Debug line
        return res.status(403).send('Forbidden - Admin access required');
    }

    res.send(`Hello admin user: ${req.user.userName}`);
  
});

module.exports = router;
