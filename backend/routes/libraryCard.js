const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all library cards
router.get("/", (req, res) => {
  const sql = "SELECT * FROM librarycard";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving library cards:", err);
      return res.status(500).send("Error getting library cards from database.");
    }
    res.status(200).json(result);
  });
});

//Get specific member
router.get("/:id", (req,res)=>{
  const id = req.params.id;
  const sql = "SELECT * FROM librarycard WHERE memberId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error retrieving library cards:", err);
      return res.status(500).send("Error getting library cards from database.");
    }
    res.status(200).json(result);
  });
})

// Create a new library card
router.post("/createLibraryCard", (req, res) => {
  const { memberId } = req.body;
  
  const checkSql = "SELECT * FROM librarycard WHERE memberId = ?";
  db.query(checkSql, [memberId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking library card existence:", checkErr);
      return res.status(500).send("Error checking library card existence");
    }

    if (checkResult.length > 0) {
      return res.status(400).send("Library Card already exists");
    }

    const insertSql = `
      INSERT INTO librarycard (memberId, status, dateIssued, dateExpired) 
      VALUES (?, 1, NOW(), DATE_ADD(NOW(), INTERVAL 2 YEAR))
    `;
    
    db.query(insertSql, [memberId], (err) => {
      if (err) {
        console.error("Error inserting library card:", err);
        return res.status(500).send("Database Error: " + err.message);
      }
      res.status(201).send("Library card added successfully");
    });
  });
});

module.exports = router;
