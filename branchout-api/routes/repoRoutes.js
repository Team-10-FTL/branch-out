const express = require("express");
const repoController = require("../controllers/repoController");

const { authenticate, requireAdmin } = require("../middleware/authCheck");
const router = express.Router();

router.get('/', authenticate, requireAdmin, repoController.getAllRepos);
router.get('/:id', authenticate, requireAdmin, repoController.getByID);
router.post('/', authenticate, requireAdmin, repoController.create);
router.put('/:id', authenticate, requireAdmin, repoController.update);
router.delete('/:id', authenticate, requireAdmin, repoController.delete);
router.get('/', authenticate, requireAdmin, repoController.filterRepos);

module.exports = router;


