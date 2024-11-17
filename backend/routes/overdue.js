const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all overdue items for a member
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT * FROM checkedoutmusichistory WHERE memberId = ? AND timeStampDue < NOW() AND timeStampReturn IS NULL
    UNION
    SELECT * FROM checkedouttechhistory WHERE memberId = ? AND timeStampDue < NOW() AND timeStampReturn IS NULL
    UNION
    SELECT * FROM checkedoutbookhistory WHERE memberId = ? AND timeStampDue < NOW() AND timeStampReturn IS NULL
  `;

  db.query(sql, [id, id, id], (err, result) => {
    if (err) {
      console.error("Error fetching overdue items:", err);
      return res.status(500).send("Error getting overdue items from the database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No overdue items found.");
    }

    res.status(200).json(result);
  });
});

module.exports = router;
