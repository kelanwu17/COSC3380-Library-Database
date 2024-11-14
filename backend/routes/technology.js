const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all technologies
router.get("/", (req, res) => {
  const sql = "SELECT * FROM technology";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting technologies from database:", err.message);
      return res.status(500).send("Error getting technologies from database.");
    }
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM technology WHERE techId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error getting technologies from database:", err.message);
      return res.status(500).send("Error getting technologies from database.");
    }
    res.status(200).json(result);
  });
});

// Create a new technology
router.post("/createTechnology", (req, res) => {
  const {
    deviceName,
    modelNumber,
    count,
    availabilityStatus,
    monetaryValue,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  // Check if the model number already exists
  const checkModelNumberSql = "SELECT * FROM technology WHERE modelNumber = ?";
  db.query(checkModelNumberSql, [modelNumber], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking model number existence:", checkErr);
      return res.status(500).send("Error checking model number existence");
    }

    if (checkResult.length > 0) {
      return res.status(400).send("Model number already exists");
    }

    const insertSql = `
      INSERT INTO technology (
        deviceName,
        modelNumber,
        count,
        availabilityStatus,
        monetaryValue,
        lastUpdatedBy,
        imgUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [
      deviceName,
      modelNumber,
      count,
      1,
      monetaryValue,
      lastUpdatedBy,
      imgUrl,
    ], (insertErr, result) => {
      if (insertErr) {
        console.error("Database Error:", insertErr.message);
        return res.status(500).send("Database Error: " + insertErr.message);
      }

      // Create instances based on count
      createTechnologyInstances(result.insertId, count, res);
    });
  });
});

// Function to create technology instances
function createTechnologyInstances(techId, count, res) {
  const instanceInsertSql = `
    INSERT INTO technologyInstance (techId, isMissing, checkedOutStatus)
    VALUES (?, ?, ?)
  `;
  
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(new Promise((resolve, reject) => {
      db.query(instanceInsertSql, [techId, false, false], (instanceErr) => {
        if (instanceErr) {
          console.error("Error creating instance:", instanceErr);
          reject("Error creating technology instances");
        } else {
          resolve();
        }
      });
    }));
  }

  Promise.all(promises)
    .then(() => res.status(201).send("Technology added successfully"))
    .catch(errMsg => res.status(500).send(errMsg));
}

// Update a technology
router.put("/updateTechnology/:id", (req, res) => {
  const { id } = req.params;
  const {
    deviceName,
    modelNumber,
    count,
    availabilityStatus,
    monetaryValue,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  // Get the current count of instances
  const getCountSql = "SELECT count FROM technology WHERE techId = ?";
  db.query(getCountSql, [id], (getCountErr, getCountResult) => {
    if (getCountErr) {
      console.error("Error retrieving current count: " + getCountErr.message);
      return res.status(500).send("Error retrieving count");
    }

    if (getCountResult.length === 0) {
      return res.status(404).send("Technology not found");
    }

    const currentCount = getCountResult[0].count;

    // Update the technology
    const updateSql = `UPDATE technology SET 
      deviceName = ?,
      modelNumber = ?,
      count = ?,
      availabilityStatus = ?,
      monetaryValue = ?,
      lastUpdatedBy = ?,
      imgUrl = ? 
      WHERE techId = ?`;

    db.query(updateSql, [
      deviceName,
      modelNumber,
      count,
      availabilityStatus,
      monetaryValue,
      lastUpdatedBy,
      imgUrl,
      id,
    ], (updateErr, result) => {
      if (updateErr) {
        console.error("Error updating technology: " + updateErr.message);
        return res.status(500).send("Error updating technology in database");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Technology not found");
      }

      // Adjust instances based on the count
      adjustTechnologyInstances(id, currentCount, count, res);
    });
  });
});

// Function to adjust technology instances
function adjustTechnologyInstances(techId, currentCount, newCount, res) {
  if (newCount > currentCount) {
    // Need to add instances
    const instancesToAdd = newCount - currentCount;
    createTechnologyInstances(techId, instancesToAdd, res);
  } else if (newCount < currentCount) {
    // Need to remove excess instances
    const instancesToRemove = currentCount - newCount;
    const removeSql = `
      DELETE FROM technologyInstance 
      WHERE techId = ? 
      ORDER BY instanceId 
      LIMIT ?
    `;
    db.query(removeSql, [techId, instancesToRemove], (removeErr) => {
      if (removeErr) {
        console.error("Error removing instances:", removeErr);
        return res.status(500).send("Error removing technology instances");
      }
      res.status(200).send(`Technology: ${techId} successfully updated`);
    });
  } else {
    // No change in count
    res.status(200).send(`Technology: ${techId} successfully updated`);
  }
}

router.put("/deactivateTech/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE technology SET availabilityStatus = 0 WHERE techId = ?";


  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting tech:", err.message);
      return res.status(500).send("Error deleting tech.");
    }
    if (results.affectedRows === 0) {
      console.warn(`No technology found with techId: ${id}`);
      return res.status(404).send("Tech not found.");
    }
    res.status(200).send("Tech deactivated");
  });
});

// Delete a technology
// router.delete("/deleteTechnology/:id", (req, res) => {
//   const sql = "DELETE FROM technology WHERE techId = ?";
//   const id = req.params.id;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error("Error deleting technology: ", err.message);
//       return res.status(500).send("Error deleting technology");
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send(`Technology with ID: ${id} not found`);
//     }
//     res.status(200).send(`Technology ${id} successfully deleted`);
//   });
// });

module.exports = router;
