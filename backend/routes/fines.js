const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all fines
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      Fines.*,
      Member.firstName,
      Member.lastName,
      CASE 
        WHEN Fines.itemType = 'book' THEN Books.title
        WHEN Fines.itemType = 'music' THEN Music.albumName
        WHEN Fines.itemType = 'tech' THEN Technology.deviceName
        ELSE NULL
      END AS itemName
    FROM 
      Fines
    JOIN 
      Member ON Fines.memberId = Member.memberId
    LEFT JOIN 
      Books ON Fines.itemType = 'book' AND Fines.itemId = Books.bookId
    LEFT JOIN 
      Music ON Fines.itemType = 'music' AND Fines.itemId = Music.musicId
    LEFT JOIN 
      Technology ON Fines.itemType = 'tech' AND Fines.itemId = Technology.techId
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving fines:", err);
      return res.status(500).send("Error getting fines from database.");
    }
    res.status(200).json(result);
  });
});


//get specific member fine
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM fines WHERE memberId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error retrieving fines:", err);
      return res.status(500).send("Error getting fines from database.");
    }
    res.status(200).json(result);
  });
});

//Pay Fine
router.put('/payFine/:id', (req,res) => {
  const id = req.params.id;
  const sql = "UPDATE fines SET paid = TRUE WHERE memberId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error updating fine:", err.message);
      return res.status(500).send("Server Error");
    }
    if (result.affectedRows === 0) {
            return res.status(404).send("Fine not found");
    }
    res.status(200).send(`Member ID: ${id} fines payed`);
  })
})

// Route to manually trigger the disable library card logic
router.get('/disableCards', (req, res) => {
  const query = `
    UPDATE LibraryCard
    SET status = false
    WHERE memberId IN (
      SELECT DISTINCT memberId
      FROM CheckedOutBookHistory
      WHERE timeStampReturn IS NULL
        AND CURRENT_DATE > timeStampDue
    );
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send('Error disabling cards: ' + error.message);
    }
    res.send('Library cards disabled for overdue items.');
  });
});
// Route to disable library cards for overdue music items
router.get('/disableCardsMusic', (req, res) => {
  const query = `
    UPDATE LibraryCard
    SET status = false
    WHERE memberId IN (
      SELECT DISTINCT memberId
      FROM CheckedOutMusicHistory
      WHERE timeStampReturn IS NULL
        AND CURRENT_DATE > timeStampDue
    );
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send('Error disabling music cards: ' + error.message);
    }
    res.send('Library cards disabled for members with overdue music items.');
  });
});

// Route to disable library cards for overdue tech items
router.get('/disableCardsTech', (req, res) => {
  const query = `
    UPDATE LibraryCard
    SET status = false
    WHERE memberId IN (
      SELECT DISTINCT memberId
      FROM CheckedOutTechHistory
      WHERE timeStampReturn IS NULL
        AND CURRENT_DATE > timeStampDue
    );
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send('Error disabling tech cards: ' + error.message);
    }
    res.send('Library cards disabled for members with overdue tech items.');
  });
});


// Route to manually trigger the "mark missing" logic
router.get('/markMissing', async (req, res) => {
  try {
    const selectQuery = `
      SELECT instanceId, memberId, bookId
      FROM CheckedOutBookHistory
      WHERE timeStampReturn IS NULL
        AND DATEDIFF(CURRENT_DATE, timeStampDue) > 14;
    `;
    const [results] = await db.query(selectQuery);

    for (const row of results) {
      await db.query(`UPDATE BookInstance SET isMissing = true WHERE instanceId = ?`, [row.instanceId]);
      await db.query(
        `INSERT INTO Fines (itemId, itemType, memberId, fineAmount)
         VALUES (?, 'book', ?, (SELECT monetaryValue FROM Books WHERE bookId = ?))`,
        [row.bookId, row.memberId, row.bookId]
      );
    }
    res.send('Books marked as missing and fines added.');
  } catch (error) {
    res.status(500).send('Error marking books as missing: ' + error.message);
  }
});

// Create a new fine
// router.post("/createFine", (req, res) => {
//   const { itemId, itemType, memberId, fineAmount } = req.body;

//   const checkItemIdAndType =
//     "SELECT * FROM fines WHERE itemId = ? AND itemType = ?";

//   db.query(checkItemIdAndType, [itemId, itemType], (checkErr, checkResult) => {
//     if (checkErr) {
//       console.error("Error checking itemId & itemType existence:", checkErr);
//       return res.status(500).send("Error checking itemId & itemType existence");
//     }

//     if (checkResult.length > 0) {
//       return res.status(400).send("Item already exists");
//     }

//     const insertSql = `
//       INSERT INTO fines (itemId, itemType, memberId, fineAmount) 
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(insertSql, [itemId, itemType, memberId, fineAmount], (err) => {
//       if (err) {
//         console.error("Error inserting fine:", err);
//         return res.status(500).send("Database Error: " + err.message);
//       }
//       res.status(201).send("Fine added successfully");
//     });
//   });
// });

// Update a fine by ID
// router.put("/updateFine/:id", (req, res) => {
//   const { id } = req.params;
//   const { fineAmount } = req.body;

//   const sql = `UPDATE fines SET fineAmount = ? WHERE finesId = ?`;
//   db.query(sql, [fineAmount, id], (err, result) => {
//     if (err) {
//       console.error("Error updating fine:", err.message);
//       return res.status(500).send("Error updating fine in database");
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send("Fine not found");
//     }
//     res.status(200).send(`Fine ID: ${id} successfully updated`);
//   });
// });

// Delete a fine by ID
// router.delete("/deleteFine/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = "DELETE FROM fines WHERE finesId = ?";

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting fine:", err.message);
//       return res.status(500).send("Error deleting fine");
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).send(`Fine with ID: ${id} not found`);
//     }

//     res.status(200).send(`Fine ID: ${id} successfully deleted`);
//   });
// });

module.exports = router;
