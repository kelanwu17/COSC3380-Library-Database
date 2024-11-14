const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all technology instances
router.get("/", (req, res) => {
  const sql = "SELECT * FROM technologyinstance";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting tech instances from database:", err.message);
      return res.status(500).send("Error getting tech instances from database.");
    }
    res.status(200).json(result);
  });
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM technologyinstance WHERE techId = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error getting tech instances from database:", err.message);
      return res.status(500).send("Error getting tech instances from database.");
    }
    res.status(200).json(result);
  });
});

module.exports = router;
