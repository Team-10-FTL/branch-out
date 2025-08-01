const express = require("express");
const repoController = require("../controllers/repoController");
const { authenticate, requireAdmin } = require("../middleware/authCheck");
const router = express.Router();

// Public endpoints (no auth required for basic data)
router.get('/languages', repoController.getAllLanguages);
router.get('/tags', repoController.getAllTags);
router.get('/owners', repoController.getAllOwners);

// Search endpoint (should be before the generic '/' route)
router.get('/search', repoController.searchRepos);

// Admin-only endpoints
router.get('/', authenticate, requireAdmin, repoController.getAllRepos);
router.post('/', authenticate, requireAdmin, repoController.create);
router.put('/:id', authenticate, requireAdmin, repoController.update);
router.delete('/:id', authenticate, requireAdmin, repoController.delete);

// Specific repo by ID
router.get('/:id', repoController.getByID);

// User interaction endpoints
router.post('/swipe', repoController.handleSwipe);

// Deprecated - keeping for backwards compatibility
router.get('/filter', repoController.filterRepos);

module.exports = router;