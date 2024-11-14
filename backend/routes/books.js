const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all books
router.get("/", (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getting books:", err);
      return res.status(500).send("Error getting books from database.");
    }
    res.json(result);
  });
});

//Get specific book
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE bookId = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error getting books:", err);
      return res.status(500).send("Error getting books from database.");
    }
    res.json(result);
  });
});

// Get books by genre
router.get("/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  const sql = "SELECT * FROM books WHERE genre = ?";
  db.query(sql, [genre], (err, result) => {
    if (err) {
      console.error("Error getting books:", err);
      return res.status(500).send("Error getting books from database.");
    }
    if (result.length === 0) {
      return res.status(404).send(`Books not found for genre: ${genre}`);
    }
    res.json(result);
  });
});

//Get book by author
router.get("/author/:author", (req, res) => {
  const author = req.params.author
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  const sql = "SELECT * FROM books WHERE author = ?";
  db.query(sql, [author], (err, result) => {
    if (err) {
      console.error("Error getting books:", err);
      return res
        .status(500)
        .send(`Error getting books by ${author} from database.`);
    }
    if (result.length === 0) {
      return res.status(404).send(`Books not found for Author: ${author}`);
    }
    res.json(result);
  });
});

// Create a new book with instances
router.post("/createBook", (req, res) => {
  const {
    title,
    genre,
    ageCategory,
    count,
    aisle,
    description,
    author,
    isbn,
    publisher,
    edition,
    monetaryValue,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  const checkIsbnSql = "SELECT * FROM books WHERE isbn = ?";
  db.query(checkIsbnSql, [isbn], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking ISBN:", checkErr);
      return res.status(500).send("Error checking ISBN existence.");
    }

    if (checkResult.length > 0) {
      return res.status(400).send("ISBN already exists.");
    }

    const insertSql = `
      INSERT INTO books (title, genre, ageCategory, count, aisle, description, 
      author, isbn, publisher, edition, monetaryValue, lastUpdatedBy, imgUrl) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        title,
        genre,
        ageCategory,
        count,
        aisle,
        description,
        author,
        isbn,
        publisher,
        edition,
        monetaryValue,
        lastUpdatedBy,
        imgUrl,
      ],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error adding book:", insertErr);
          return res.status(500).send("Database Error: " + insertErr.message);
        }

        const bookId = result.insertId;
        const insertInstanceSql = `
          INSERT INTO bookinstance (bookId, isMissing, checkedOutStatus) 
          VALUES (?, ?, ?)
        `;

        const instancePromises = Array.from(
          { length: count },
          () =>
            new Promise((resolve, reject) => {
              db.query(
                insertInstanceSql,
                [bookId, false, false],
                (err, res) => {
                  if (err) reject(err);
                  else resolve(res);
                }
              );
            })
        );

        Promise.all(instancePromises)
          .then(() =>
            res
              .status(201)
              .send("Book added successfully with instances created.")
          )
          .catch((err) =>
            res
              .status(500)
              .send("Error creating book instances: " + err.message)
          );
      }
    );
  });
});

// Update a book and adjust instances if needed
router.put("/updateBook/:bookId", (req, res) => {
  const { bookId } = req.params;
  const {
    title,
    genre,
    ageCategory,
    count,
    aisle,
    description,
    author,
    isbn,
    publisher,
    edition,
    monetaryValue,
    lastUpdatedBy,
    imgUrl,
  } = req.body;

  const getCountSql = "SELECT count FROM books WHERE bookId = ?";
  db.query(getCountSql, [bookId], (err, result) => {
    if (err) return res.status(500).send("Database Error: " + err.message);

    const currentCount = result[0]?.count;

    if (currentCount < count) {
      const instancesToAdd = count - currentCount;
      const insertInstanceSql = `
        INSERT INTO bookinstance (bookId, checkedOutStatus) 
        VALUES (?, ?)
      `;

      const promises = Array.from(
        { length: instancesToAdd },
        () =>
          new Promise((resolve, reject) => {
            db.query(insertInstanceSql, [bookId, false], (err, res) => {
              if (err) reject(err);
              else resolve(res);
            });
          })
      );

      Promise.all(promises)
        .then(() => updateBookRecord())
        .catch((err) =>
          res.status(500).send("Error adding instances: " + err.message)
        );
    } else if (currentCount > count) {
      const instancesToRemove = currentCount - count;
      const deleteInstanceSql = `
        DELETE FROM bookinstance 
        WHERE bookId = ? AND checkedOutStatus = false 
        ORDER BY instanceId DESC LIMIT ?
      `;

      db.query(deleteInstanceSql, [bookId, instancesToRemove], (err) => {
        if (err)
          return res
            .status(500)
            .send("Error deleting instances: " + err.message);
        updateBookRecord();
      });
    } else {
      updateBookRecord();
    }

    function updateBookRecord() {
      const updateSql = `
        UPDATE books 
        SET title = ?, genre = ?, ageCategory = ?, count = ?, aisle = ?, 
            description = ?, author = ?, isbn = ?, publisher = ?, edition = ?, 
            monetaryValue = ?, lastUpdatedBy = ?, imgUrl = ? 
        WHERE bookId = ?
      `;

      db.query(
        updateSql,
        [
          title,
          genre,
          ageCategory,
          count,
          aisle,
          description,
          author,
          isbn,
          publisher,
          edition,
          monetaryValue,
          lastUpdatedBy,
          imgUrl,
          bookId,
        ],
        (err) => {
          if (err)
            return res.status(500).send("Database Error: " + err.message);
          res.status(200).send("Book updated successfully.");
        }
      );
    }
  });
});

router.put("/deactivateBook/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE books SET availabilityStatus = 0 WHERE bookId = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting book:", err.message);
      return res.status(500).send("Error deleting book .");
    }
    res.status(200).send("Book deactivated");
  });
});

// Delete a book and its instances
// router.delete("/deleteBook/:id", (req, res) => {
//   const { id } = req.params;

//   const deleteInstancesSql = "DELETE FROM bookinstance WHERE bookId = ?";
//   db.query(deleteInstancesSql, [id], (err) => {
//     if (err) {
//       console.error("Error deleting instances:", err.message);
//       return res.status(500).send("Error deleting book instances.");
//     }

//     const deleteBookSql = "DELETE FROM books WHERE bookId = ?";
//     db.query(deleteBookSql, [id], (err) => {
//       if (err) {
//         console.error("Error deleting book:", err.message);
//         return res.status(500).send("Error deleting book.");
//       }
//       res.status(200).send(`Book ${id} successfully deleted.`);
//     });
//   });
// });

module.exports = router;
