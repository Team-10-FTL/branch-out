const express = require("express");
const userController = require("../controllers/userController");

const { authenticate, requireAdmin } = require("../middleware/authCheck");
const router = express.Router();
const { hybridAuth } = require("../middleware/authCheck");

router.get("/recommendations/:userId", userController.getRecommendations);
router.get("/profile", authenticate, userController.getUserProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.get("/users", authenticate, requireAdmin, userController.getAllUsers);
router.get("/:id", authenticate, userController.getUser);
router.get("/preferences", authenticate, userController.getPreferences);
router.delete("/:id", authenticate, requireAdmin, userController.deleteUser);

module.exports = router;