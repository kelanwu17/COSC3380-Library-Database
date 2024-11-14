const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all music instances
router.get("/", (req, res) => {
  const sql = "SELECT * FROM musicinstance";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting music instances from database:", err);
      return res.status(500).send("Error getting music instances from database.");
    }
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM musicinstance WHERE musicId = ?";
  
  db.query(sql,[id], (err, result) => {
    if (err) {
      console.error("Error getting music instances from database:", err);
      return res.status(500).send("Error getting music instances from database.");
    }
    res.status(200).json(result);
  });
});

module.exports = router;
