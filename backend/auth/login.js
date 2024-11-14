const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/member", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM member WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Database error: ", err.message);
      return res.status(500).send("Internal server error");
    }

    if (result.length === 0) {
      return res.status(401).send("Invalid username or password");
    }
    res.status(200).json(result);
  });
});

router.post("/admin", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Database error: ", err.message);
      return res.status(500).send("Internal server error");
    }

    if (result.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    res.status(200).json(result);
  });
});

module.exports = router;
