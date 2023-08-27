const express = require("express");

const router = express.Router();
const userRoutes = require("./userRoutes");
const moodRoutes = require("./moodRoutes");

router.get("/", (req, res) => {
    res.json({
        message: "Emoji Mood Tracker API Running.",
    });
});

router.use("/user", userRoutes);
router.use("/mood", moodRoutes);

module.exports = router;