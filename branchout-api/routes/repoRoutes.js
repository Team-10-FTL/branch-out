const express = require("express");
const repoController = require("../controllers/repoController");

const { authenticate, requireAdmin } = require("../middleware/authCheck");
const router = express.Router();

router.get('/', repoController.getAllRepos);
router.get('/:id', repoController.getByID);
router.post('/', authenticate, requireAdmin, repoController.create);
router.put('/:id', authenticate, requireAdmin, repoController.update);
router.delete('/:id', authenticate, requireAdmin, repoController.delete);
router.get('/', authenticate, requireAdmin, repoController.filterRepos);
router.post('/swipe', authenticate, requireAdmin, repoController.handleSwipe);

module.exports = router;


