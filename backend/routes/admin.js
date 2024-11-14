const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all admins
router.get("/", (req, res) => {
  const sql = "SELECT * FROM admin";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res
        .status(500)
        .json({ message: "Error fetching admins from database." });
    }
    res.status(200).json(result);
  });
});

// Get specific admin
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM admin WHERE adminId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching admin:", err);
      return res.status(500).json({ message : `Error fetching admin ${id}`})
    }
    res.status(200).json(result);
  })
})

// Add new admin
router.post("/createAdmin", async (req, res) => {
  const { username, password, firstName, lastName, email, phone, DOB, roles, createdBy } =
    req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "username, password, and email are required." });
  }

  const checkSql = "SELECT * FROM member WHERE email = ? OR username = ?";
  db.query(checkSql, [email, username], async (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking user existence:", checkErr);
      return res
        .status(500)
        .json({ message: "Error checking user existence." });
    }

    if (checkResult.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or username already in use." });
    }

    const insertSql = `
        INSERT INTO admin (username, password, firstName, lastName, email, phone, DOB, roles, active, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    db.query(
      insertSql,
      [username, password, firstName, lastName, email, phone, DOB, roles, true, createdBy],
      (insertErr) => {
        if (insertErr) {
          console.error("Error adding admin:", insertErr);
          return res
            .status(500)
            .json({ message: "Error adding admin to database." });
        }
        res.status(201).json({ message: "Admin added successfully." });
      }
    );
  });
});

// Update admin
router.put("/updateAdmin/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, DOB, roles } = req.body;

  const sql = `
    UPDATE admin SET
      firstName = ?, lastName = ?, email = ?, phone = ?, DOB = ?, roles = ?
    WHERE adminId = ?
  `;
  db.query(
    sql,
    [firstName, lastName, email, phone, DOB, roles, id],
    (err, result) => {
      if (err) {
        console.error("Error updating admin:", err);
        return res.status(500).json({ message: "Error updating admin." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found." });
      }
      res.status(200).json({ message: `Admin ${id} successfully updated.` });
    }
  );
});

router.put("/deactivateAdmin/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE admin SET active = 0 WHERE adminId = ?"
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating admin:", err);
      return res.status(500).json({ message: "Error updating admin." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ message: `Admin ${id} successfully deactivated.` });
  })

})

// Delete admin
// router.delete("/deleteAdmin/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = "DELETE FROM admin WHERE adminId = ?";
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting admin:", err);
//       return res.status(500).json({ message: "Error deleting admin." });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Admin not found." });
//     }
//     res.status(200).json({ message: `Admin ${id} successfully deleted.` });
//   });
// });

module.exports = router;
