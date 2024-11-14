const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {sendWelcomeMail} = require("../mailer/mailer");
// Get all members
router.get("/", (req, res) => {
  const sql = "SELECT * FROM member";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching members:", err);
      return res
        .status(500)
        .json({ message: "Error fetching members from database." });
    }
    res.status(200).json(result);
  });
});

//Get specific member
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM member WHERE memberId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching members:", err);
      return res
        .status(500)
        .json({ message: "Error fetching members from database." });
    }
    res.status(200).json(result);
  });
});

// Add new member
router.post("/createMember", (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phone,
    DOB,
    role,
    preferences,
    createdBy,
  } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, password, and email are required." });
  }
  // Check for existing email or username
  const checkSql = "SELECT * FROM member WHERE email = ? OR username = ?";
  db.query(checkSql, [email, username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking user existence:", checkErr);
      return res
        .status(500)
        .json({ message: "Error checking user existence." });
    }

    if (checkResult.length > 0) {
      const existingUser = checkResult[0];
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already in use." });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already in use." });
      }
    }

    const insertSql = `
      INSERT INTO member (username, password, firstName, lastName, email, phone, DOB, preferences, createdAt, updatedAt, role, accountStatus, createdBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(),?, ?, ?)`;

    db.query(
      insertSql,
      [
        username,
        password,
        firstName,
        lastName,
        email,
        phone,
        DOB,
        preferences,
        role,
        true,
        createdBy,
      ],
      async (insertErr) => {
        if (insertErr) {
          console.error("Error adding user to database:", insertErr);
          return res
            .status(500)
            .json({ message: "Error adding user to database." });
        }
        let to = email;
        try {
          await sendWelcomeMail(to, firstName, username, password);
          res.status(201).send("Member created and Email sent successfully!");
        } catch (insertErr) {
          console.error("Error sending email:", insertErr);
          res.status(201).send("Member created but Error sending email");
        }
      }
    );
  });
});

// Update member
router.put("/updateMember/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, DOB, preferences } = req.body;

  const sql = `UPDATE member SET 
    firstName = ?, 
    lastName = ?, 
    email = ?, 
    phone = ?, 
    DOB = ?, 
    preferences = ? 
    WHERE memberId = ?`;

  db.query(
    sql,
    [firstName, lastName, email, phone, DOB, preferences, id],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).send("Error updating user in database");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(`Member: ${id} successfully updated`);
    }
  );
});

//update member preferences
router.put("/updateMemberPref/:id", (req, res) => {
  const { id } = req.params;
  const { preferences } = req.body;

  const sql = `UPDATE member SET 
    preferences = ? 
    WHERE memberId = ?`;

  db.query(
    sql,
    [preferences, id],
    (err, result) => {
      if (err) {
        console.error("Error updating user preferences:", err);
        return res.status(500).send("Error updating user preferences in database");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(`Member: ${id} preferences successfully updated`);
    }
  );
});



router.put("/deactivateMember/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE member SET accountStatus = 0 WHERE memberId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating admin:", err);
      return res.status(500).json({ message: "Error updating member." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found." });
    }
    res.status(200).json({ message: `Member ${id} successfully deactivated.` });
  });
});
// Delete member from database
// router.delete("/deleteMember/:id", (req, res) => {
//   const sql = "DELETE FROM member WHERE memberId = ?";
//   const { id } = req.params;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting member:", err);
//       return res.status(500).send("Error deleting member");
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send(`Member with ID: ${id} not found`);
//     }
//     res.status(200).send(`Member: ${id} successfully deleted`);
//   });
// });

module.exports = router;
