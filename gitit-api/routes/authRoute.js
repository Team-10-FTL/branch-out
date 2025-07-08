const express = require('express');
const controller = require("../controllers/authController");
const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/createAdmin", controller.createAdmin)

module.exports = router;