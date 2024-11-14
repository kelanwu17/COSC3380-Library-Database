const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all book instances
router.get("/", (req, res) => {
  const sql = "SELECT * FROM bookinstance";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching book instances:", err);
      return res.status(500).send("Error getting book instances from database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No book instances found.");
    }

    res.status(200).json(result);
  });
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM bookinstance WHERE bookId = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching book instances:", err);
      return res.status(500).send("Error getting book instances from database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No book instances found.");
    }

    res.status(200).json(result);
  });
});

module.exports = router;
