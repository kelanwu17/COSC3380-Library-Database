const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all employee logs
router.get("/", (req, res) => {
  const sql = "SELECT * FROM employeelog";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving employee logs:", err);
      return res.status(500).send("Error retrieving employee logs from database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No employee logs found.");
    }

    res.status(200).json(result);
  });
});

// Update an employee log by ID
router.put("/updateEmployeeLog/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).send("Description is required.");
  }

  const sql = `UPDATE employeelog SET description = ? WHERE employeeLogId = ?`;

  db.query(sql, [description, id], (err, result) => {
    if (err) {
      console.error("Error updating employee log:", err);
      return res.status(500).send("Error updating employee log in database.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Employee log not found.");
    }

    res.status(200).send(`Employee log with ID ${id} successfully updated.`);
  });
});

module.exports = router;
