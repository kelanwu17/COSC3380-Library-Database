const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all checked-out music entries
router.get("/", (req, res) => {
  const sql = "SELECT * FROM checkedoutmusichistory";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching checked-out music:", err);
      return res.status(500).send("Error retrieving music from the database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No checked-out music records found.");
    }

    res.status(200).json(result);
  });
});

router.get("/get/allMusicInfo", (req, res) => {
  const sql = `
    SELECT 
      CheckedOutMusicHistory.*,
      Music.albumName AS musicAlbumName,  -- Ensure the column name matches
      Music.musicGenre AS musicGenre,
      Member.username AS memberUsername
    FROM 
      CheckedOutMusicHistory
    JOIN 
      Music ON CheckedOutMusicHistory.musicId = Music.musicId
    JOIN 
      Member ON CheckedOutMusicHistory.memberId = Member.memberId
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching checked-out music:", err);
      return res
        .status(500)
        .send("Error getting checked-out music from the database.");
    }

    if (result.length === 0) {
      return res.status(404).send("No checked-out music found.");
    }

    res.status(200).json(result);
  });
});



router.get("/:id", (req, res) => {
  const memberId = req.params.id;
  const sql = "SELECT * FROM checkedoutmusichistory WHERE memberId = ?";
  db.query(sql, [memberId], (err, result) => {
    if (err) {
      console.error("Error fetching checked-out music:", err);
      return res
        .status(500)
        .send("Error getting checked-out music from the database.");
    }
    const musicPromise = result.map((music) => {
      const albumNameSql = "SELECT albumName FROM music WHERE musicId = ?";
      return new Promise((resolve, reject) => {
        db.query(albumNameSql, [music.musicId], (err2, musicResult) => {
          if (err2) {
            console.error("Error retrieving music name:", err2);
            return reject("Error getting album name from db");
          }
          music.albumName = musicResult[0]?.albumName || "Unknown Title";
          resolve(music);
        });
      });
    });

    Promise.all(musicPromise)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});


// Insert a new checked-out music entry
router.post("/insertCheckOutMusic", (req, res) => {
  const { memberId, musicId, instanceId, role } = req.body;
  if (!memberId || !musicId || !instanceId) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const limitSql =
    "SELECT * FROM checkedoutmusichistory WHERE memberId = ? AND timeStampReturn IS NULL";
  db.query(limitSql, [memberId], (limitErr, limitRes) => {
    if (limitErr) {
      console.error("Error checking existing music checkout:", limitErr);
      return res.status(500).send("Error checking existing music checkout.");
    }

    if (role === "student" && limitRes.length > 1) {
      return res.status(400).send("Limit Exceeded");
    } else if (role === "faculty" && limitRes.length > 2) {
      return res.status(400).send("Limit Exceeded");
    }

    const checkSql =
      "SELECT * FROM checkedoutmusichistory WHERE memberId = ? AND musicId = ? AND instanceId = ? AND timeStampReturn IS NULL";
    db.query(checkSql, [memberId, musicId, instanceId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking existing music checkout:", checkErr);
        return res.status(500).send("Error checking existing music checkout.");
      }

      if (checkResult.length > 0) {
        return res.status(400).send("This music item is already checked out.");
      }

      let insertSql = ``;
      if (role === "student") {
        insertSql = `
          INSERT INTO checkedoutmusichistory 
          (memberId, musicId, instanceId, timeStampDue, timeStampCheckedOut) 
          VALUES (?, ?, ?, NOW() + INTERVAL 1 WEEK, NOW())`;
      } else if (role === "faculty") {
        insertSql = `
          INSERT INTO checkedoutmusichistory 
          (memberId, musicId, instanceId, timeStampDue, timeStampCheckedOut) 
          VALUES (?, ?, ?, NOW() + INTERVAL 2 WEEK, NOW())`;
      }

      db.query(insertSql, [memberId, musicId, instanceId], (err) => {
        if (err) {
          console.error("Error inserting checked-out music:", err);
          return res.status(500).send("Error adding checked-out music.");
        }
        res.status(201).send("Music checked out successfully.");
      });
    });
  });
});

router.put("/updateCheckOutMusic/:id", (req, res) => {
  const { id } = req.params;

  // Step 1: Retrieve musicId and music title
  const getMusicAndWaitlistSql = `
    SELECT cmh.musicId, m.albumName AS musicTitle, mem.email 
    FROM checkedoutmusichistory cmh
    JOIN Music m ON cmh.musicId = m.musicId
    LEFT JOIN waitlist w ON cmh.musicId = w.itemId
    LEFT JOIN Member mem ON w.memberId = mem.memberId
    WHERE cmh.checkedOutMusicHistoryId = ? 
      AND w.itemType = 'music' 
      AND w.active = TRUE
    ORDER BY w.waitlistTimeStamp ASC
    LIMIT 1`;

  db.query(getMusicAndWaitlistSql, [id], (waitlistErr, waitlistRes) => {
    if (waitlistErr) {
      console.error("Error fetching waitlist:", waitlistErr);
      return res.status(500).send("Error processing waitlist.");
    }

    const nextWaitlistEntry = waitlistRes[0];
    const nextWaitlistMemberEmail = nextWaitlistEntry ? nextWaitlistEntry.email : null;
    const musicTitle = nextWaitlistEntry ? nextWaitlistEntry.musicTitle : null;

    // Step 2: Update the return timestamp
    const updateReturnSql = `
      UPDATE checkedoutmusichistory 
      SET timeStampReturn = NOW() 
      WHERE checkedOutMusicHistoryId = ?`;
      
    db.query(updateReturnSql, [id], (err, result) => {
      if (err) {
        console.error("Error updating return timestamp:", err);
        return res.status(500).send("Error updating the return timestamp.");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Checked-out music not found.");
      }

      // Step 3: Send notification if there is a next waitlist member
      if (nextWaitlistMemberEmail && musicTitle) {
        sendAvailableToCheckOut(nextWaitlistMemberEmail, musicTitle)
          .then(() => {
            console.log("Notification email sent to waitlist member.");
          })
          .catch((emailErr) => {
            console.error("Error sending email notification:", emailErr);
          });
      } else {
        console.log("No waitlist entries. No email sent.");
      }

      res.status(200).send("Music returned successfully.");
    });
  });
});



// Delete a checked-out music entry
router.delete("/deleteCheckOutMusic/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM checkedoutmusichistory WHERE checkedOutMusicHistoryId = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting checked-out music:", err);
      return res.status(500).send("Error deleting checked-out music.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Checked-out music record not found.");
    }

    res.status(200).send(`Checked-out music record ${id} deleted successfully.`);
  });
});

module.exports = router;
