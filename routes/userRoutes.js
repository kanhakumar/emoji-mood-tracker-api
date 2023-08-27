const express = require("express");
const userController = require("../controllers/userController");
const { authenticateUser } = require("../utils/authUtils");

const router = express.Router();

router.post("/", userController.addUser);
router.put("/updateSharingOption", authenticateUser, userController.updateSharingOption);
router.post("/login", userController.login);

module.exports = router;