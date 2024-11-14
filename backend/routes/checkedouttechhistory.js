const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all checked-out tech items
router.get("/", (req, res) => {
  const sql = "SELECT * FROM checkedouttechhistory";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving tech history:", err);
      return res.status(500).send("Error retrieving tech items from database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No checked-out tech records found.");
    }

    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const memberId = req.params.id;
  const sql = "SELECT * FROM checkedouttechhistory WHERE memberId = ?";
  db.query(sql, [memberId], (err, result) => {
    if (err) {
      console.error("Error fetching checked-out tech:", err);
      return res
        .status(500)
        .send("Error getting checked-out tech from the database.");
    }
    const techPromise = result.map((tech) => {
      const deviceNameSql = "SELECT deviceName FROM technology WHERE techId = ?";
      return new Promise((resolve, reject) => {
        db.query(deviceNameSql, [tech.techId], (err2, techResult) => {
          if (err2) {
            console.error("Error retrieving device name:", err2);
            return reject("Error getting device name from db");
          }
          tech.deviceName = techResult[0]?.deviceName || "Unknown Title";
          resolve(tech);
        });
      });
    });

    Promise.all(techPromise)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});

// Insert a new checked-out tech item
router.post("/insertCheckOutTech", (req, res) => {
  const { memberId, techId, instanceId, role } = req.body;
  if (!memberId || !techId || !instanceId) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const limitSql =
    "SELECT * FROM checkedouttechhistory WHERE memberId = ? AND timeStampReturn IS NULL";
  db.query(limitSql, [memberId], (limitErr, limitRes) => {
    if (limitErr) {
      console.error("Error checking existing tech checkout:", limitErr);
      return res.status(500).send("Error checking existing tech checkout.");
    }

    if (role === "student" && limitRes.length > 1) {
      return res.status(400).send("Limit Exceeded");
    } else if (role === "faculty" && limitRes.length > 2) {
      return res.status(400).send("Limit Exceeded");
    }

    const checkSql =
      "SELECT * FROM checkedouttechhistory WHERE memberId = ? AND techId = ? AND instanceId = ? AND timeStampReturn IS NULL";
    db.query(checkSql, [memberId, techId, instanceId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking tech item:", checkErr);
        return res.status(500).send("Error checking existing tech checkout.");
      }

      if (checkResult.length > 0) {
        return res.status(400).send("This tech item is already checked out.");
      }

      let insertSql = ``;
      if (role === "student") {
        insertSql = `
          INSERT INTO checkedouttechhistory 
          (memberId, techId, instanceId, timeStampDue, timeStampCheckedOut) 
          VALUES (?, ?, ?, NOW() + INTERVAL 1 WEEK, NOW())`;
      } else if (role === "faculty") {
        insertSql = `
          INSERT INTO checkedouttechhistory 
          (memberId, techId, instanceId, timeStampDue, timeStampCheckedOut) 
          VALUES (?, ?, ?, NOW() + INTERVAL 2 WEEK, NOW())`;
      }

      db.query(insertSql, [memberId, techId, instanceId], (err) => {
        if (err) {
          console.error("Error inserting tech item:", err);
          return res.status(500).send("Error adding tech item to database.");
        }
        res.status(201).send("Tech item checked out successfully.");
      });
    });
  });
});

router.put("/updateCheckOutTech/:id", (req, res) => {
  const { id } = req.params;

  // Step 1: Retrieve techId and waitlist information for notification
  const getTechAndWaitlistSql = `
    SELECT cth.techId, t.deviceName AS techName, m.email 
    FROM checkedouttechhistory cth
    JOIN Technology t ON cth.techId = t.techId
    LEFT JOIN waitlist w ON cth.techId = w.itemId
    LEFT JOIN Member m ON w.memberId = m.memberId
    WHERE cth.checkedOutTechHistoryId = ? 
      AND w.itemType = 'tech' 
      AND w.active = TRUE
    ORDER BY w.waitlistTimeStamp ASC
    LIMIT 1`;

  db.query(getTechAndWaitlistSql, [id], (waitlistErr, waitlistRes) => {
    if (waitlistErr) {
      console.error("Error fetching waitlist:", waitlistErr);
      return res.status(500).send("Error processing waitlist.");
    }

    const nextWaitlistEntry = waitlistRes[0];
    const nextWaitlistMemberEmail = nextWaitlistEntry ? nextWaitlistEntry.email : null;
    const techName = nextWaitlistEntry ? nextWaitlistEntry.techName : null;

    // Step 2: Update the return timestamp
    const updateReturnSql = `
      UPDATE checkedouttechhistory 
      SET timeStampReturn = NOW() 
      WHERE checkedOutTechHistoryId = ?`;

    db.query(updateReturnSql, [id], (err, result) => {
      if (err) {
        console.error("Error updating return timestamp:", err);
        return res.status(500).send("Error updating the return timestamp.");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Checked-out tech not found.");
      }

      // Step 3: Send notification if there is a next waitlist member
      if (nextWaitlistMemberEmail && techName) {
        sendAvailableToCheckOut(nextWaitlistMemberEmail, techName)
          .then(() => {
            console.log("Notification email sent to waitlist member.");
          })
          .catch((emailErr) => {
            console.error("Error sending email notification:", emailErr);
          });
      } else {
        console.log("No waitlist entries. No email sent.");
      }

      res.status(200).send("Tech returned successfully.");
    });
  });
});



// Delete a checked-out tech entry
router.delete("/deleteCheckOutTech/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM checkedouttechhistory WHERE checkedOutTechHistoryId = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting tech item:", err);
      return res.status(500).send("Error deleting tech item.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Checked-out tech item not found.");
    }

    res.status(200).send(`Tech item with ID ${id} deleted successfully.`);
  });
});

module.exports = router;
