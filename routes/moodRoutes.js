const express = require("express");
const moodController = require("../controllers/moodController");
const { authenticateUser } = require("../utils/authUtils");

const router = express.Router();

router.route("/")
    .post(authenticateUser, moodController.logMood)
    .put(authenticateUser, moodController.updateMood)
    .delete(authenticateUser, moodController.deleteMood);
router.post("/monthlySummary", authenticateUser, moodController.monthlySummary);
router.post("/emojiStatistics", moodController.emojiStatistics);
router.post("/retriveMoods", authenticateUser, moodController.retriveMoods);
router.get("/publicMoods", moodController.publicMoods);

module.exports = router;