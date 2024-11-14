const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all event signups
router.get("/", (req, res) => {
  const sql = "SELECT * FROM eventsignup";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving event signups:", err);
      return res.status(500).json({error:"Error getting members from database."});
    }
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM eventsignup WHERE eventId = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error retrieving event signups:", err);
      return res.status(500).json({error:"Error getting members from database."});
    }
    res.status(200).json(result);
  });
});

router.get("/member/:id", (req, res) => {
  const id = req.params.id;
  const signupSql = "SELECT * FROM eventsignup WHERE memberId = ?";

  db.query(signupSql, [id], (err, signups) => {
    if (err) {
      console.error("Error retrieving event signups:", err);
      return res.status(500).json({ error: "Error getting signups from database." });
    }

    // If there are no signups, respond with an empty array
    if (signups.length === 0) {
      return res.status(200).json([]);
    }

    // Process each signup to retrieve event names
    const eventPromises = signups.map((signup) => {
      const eventNameSql = "SELECT title,location, timeDate FROM event WHERE eventId = ?";
      return new Promise((resolve, reject) => {
        db.query(eventNameSql, [signup.eventId], (err2, eventResult) => {
          if (err2) {
            console.error("Error retrieving event name:", err2);
            return reject("Error getting event names from database.");
          }
          // Add the event title to the signup object
          signup.eventTitle = eventResult[0]?.title || "Unknown Event";
          signup.location = eventResult[0]?.location || "Unknown Location";
          signup.timeDate = eventResult[0]?.timeDate || "Unknown DateTime";
          resolve(signup);
        });
      });
    });

    // Wait for all event title queries to complete
    Promise.all(eventPromises)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
});


// Insert a new event signup
router.post("/insertEventSignUp", (req, res) => {
  const { memberId, eventId } = req.body;
  const checkAlreadySignUp =
    "SELECT * FROM eventsignup WHERE memberId = ? AND eventId = ?";
  
  db.query(checkAlreadySignUp, [memberId, eventId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking event signup existence:", checkErr);
      return res.status(500).send("Error checking event signup existence");
    }
    
    if (checkResult.length > 0) {
      return res.status(400).send("Member already signed up");
    }

    const insertSql =
      "INSERT INTO eventsignup (memberId, eventId, timeEnrolled, checkIn) VALUES (?, ?, NOW(), FALSE)";
    
    db.query(insertSql, [memberId, eventId], (err, result) => {
      if (err) {
        console.error("Error inserting event signup:", err);
        return res.status(500).send("Error inserting event signup");
      }
      res.status(201).send("User successfully signed up");
    });
  });
});

// Edit an event signup by ID
router.put("/updateEventSignUp/:id", (req, res) => {
  const { id } = req.params;
  const { checkIn } = req.body;
  
  const sql = `UPDATE eventsignup SET checkIn = ? WHERE eventSignUpId = ?`;
  
  db.query(sql, [checkIn, id], (err, result) => {
    if (err) {
      console.error("Error updating event signup:", err);
      return res.status(500).send("Error updating event signup");
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).send("Event signup not found");
    }
    
    res.status(200).send("Checked In Successfully");
  });
});

// Delete an event signup by ID
router.delete("/deleteEventSignUp/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM eventsignup WHERE eventSignUpId = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting event signup:", err);
      return res.status(500).send("Error deleting event signup");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Event signup not found");
    }

    res.status(200).send("Event sign up was deleted");
  });
});

module.exports = router;
