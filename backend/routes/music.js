const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all music entries
router.get("/", (req, res) => {
  const sql = "SELECT * FROM music";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting music from database:", err);
      return res.status(500).send("Error getting music from database.");
    }
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM music WHERE musicId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error getting music from database:", err);
      return res.status(500).send("Error getting music from database.");
    }
    res.status(200).json(result);
  });
});

//get by genre
router.get("/genre/:genre", (req,res) => {
  const genre = req.params.genre;
  const sql = "SELECT * FROM music WHERE musicGenre = ?";
  db.query(sql, [genre], (err, result) => {
    if (err) {
      console.error("Error getting music from database:", err);
      return res.status(500).send("Error getting music from database.");
    }
    res.status(200).json(result);
  });
})

// Add new music entry
router.post("/createMusic", (req, res) => {
  const {
    musicGenre,
    artist,
    dateReleased,
    count,
    albumName,
    monetaryValue,
    availabilityStatus,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  const checkAlbumAndArtistSql = "SELECT * FROM music WHERE artist = ? AND albumName = ?";
  db.query(checkAlbumAndArtistSql, [artist, albumName], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking album/artist in DB:", checkErr.message);
      return res.status(500).send("Error checking album/artist in DB");
    }

    if (checkResult.length > 0) {
      return res.status(400).send("Music already exists");
    }

    const insertSql = `INSERT INTO music (musicGenre, artist, dateReleased, count, albumName, monetaryValue, availabilityStatus, lastUpdatedBy, imgUrl) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(insertSql, [
      musicGenre,
      artist,
      dateReleased,
      count,
      albumName,
      monetaryValue,
      availabilityStatus,
      lastUpdatedBy,
      imgUrl,
    ], (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send("Database error: " + err.message);
      }

      // Create instances based on count
      const insertInstanceSql = "INSERT INTO musicinstance (musicId, checkedOutStatus, isMissing) VALUES (?, ?, ?)";
      const promises = Array.from({ length: count }, () => {
        return new Promise((resolve, reject) => {
          db.query(insertInstanceSql, [result.insertId, false, false], (instanceErr) => {
            if (instanceErr) reject(instanceErr);
            else resolve();
          });
        });
      });

      Promise.all(promises)
        .then(() => res.status(201).send("Music and instances added successfully"))
        .catch((instanceErr) => {
          console.error("Error creating instances:", instanceErr.message);
          res.status(500).send("Error creating instances: " + instanceErr.message);
        });
    });
  });
});

// Update existing music entry
router.put("/updateMusic/:id", (req, res) => {
  const { id } = req.params;
  const {
    musicGenre,
    artist,
    dateReleased,
    count,
    albumName,
    monetaryValue,
    availabilityStatus,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  // Get the current count of instances
  const getCurrentCountSql = "SELECT count FROM music WHERE musicId = ?";
  db.query(getCurrentCountSql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching current music count:", err.message);
      return res.status(500).send("Error fetching current music count");
    }

    if (result.length === 0) {
      return res.status(404).send("Music not found");
    }

    const currentCount = result[0].count;

    // Update the music record
    const updateSql = `UPDATE music SET
      musicGenre = ?, artist = ?, dateReleased = ?, count = ?, 
      albumName = ?, monetaryValue = ?, availabilityStatus = ?, 
      lastUpdatedBy = ?, imgUrl = ? 
      WHERE musicId = ?`;

    db.query(updateSql, [
      musicGenre,
      artist,
      dateReleased,
      count,
      albumName,
      monetaryValue,
      availabilityStatus,
      lastUpdatedBy,
      imgUrl,
      id,
    ], (err, updateResult) => {
      if (err) {
        console.error("Error updating music:", err.message);
        return res.status(500).send("Error updating music in database");
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).send("Music not found");
      }

      // Handle instances based on the updated count
      if (currentCount < count) {
        // Add new instances
        const instancesToAdd = count - currentCount;
        const insertInstanceSql = "INSERT INTO musicinstance (musicId, checkedOutStatus) VALUES (?, ?)";
        
        const promises = Array.from({ length: instancesToAdd }, () => {
          return new Promise((resolve, reject) => {
            db.query(insertInstanceSql, [id, false], (instanceErr) => {
              if (instanceErr) reject(instanceErr);
              else resolve();
            });
          });
        });

        Promise.all(promises)
          .then(() => res.status(200).send(`Music: ${id} successfully updated, added ${instancesToAdd} new instances`))
          .catch((instanceErr) => {
            console.error("Error creating instances:", instanceErr.message);
            res.status(500).send("Error creating instances: " + instanceErr.message);
          });
      } else if (currentCount > count) {
        // Remove instances if count decreased
        const instancesToRemove = currentCount - count;
        const deleteInstanceSql = `
          DELETE FROM musicinstance 
          WHERE musicId = ? AND checkedOutStatus = false 
          ORDER BY instanceId DESC LIMIT ?`;

        db.query(deleteInstanceSql, [id, instancesToRemove], (err) => {
          if (err) {
            console.error("Error deleting instances:", err.message);
            return res.status(500).send("Error deleting instances: " + err.message);
          }
          res.status(200).send(`Music: ${id} successfully updated, removed ${instancesToRemove} instances`);
        });
      } else {
        // If count hasn't changed
        res.status(200).send(`Music: ${id} successfully updated`);
      }
    });
  });
});

router.put("/deactivateMusic/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE music SET availabilityStatus = 0 WHERE musicId = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting music:", err.message);
      return res.status(500).send("Error deleting music.");
    }
    res.status(200).send("Music deactivated");
  });
});

// Delete music entry
// router.delete("/deleteMusic/:id", (req, res) => {
//   const sql = "DELETE FROM music WHERE musicId = ?";
//   const id = req.params.id;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting music:", err.message);
//       return res.status(500).send("Error deleting music");
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send("Music not found");
//     }
//     res.status(200).send(`Music ${id} successfully deleted`);
//   });
// });

module.exports = router;
