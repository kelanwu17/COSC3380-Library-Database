const express = require("express");
const router = express.Router();
const {sendWelcomeMail, checkedOutMail, reserveMail, waitlistMail} = require("../mailer/mailer");

const db = require("../config/db");

function getItemName(type, itemId) {
    let sql = "";
    if (type === "book") {
        sql = "SELECT * FROM books WHERE bookId = ?"
    } else if (type === "music") {
        sql = "SELECT albumName FROM music WHERE musicId = ?"
    } else if (type === "tech") {
        sql = "SELECT deviceName From technology WHERE techId = ?"
    }
    return new Promise((resolve, reject) => {
      db.query(sql, [itemId], (err, result) => {
        if (err) {
          console.error("Server Error");
          return reject("Server Error");
        }
        if (result.length === 0) {
          return reject("Can't find book");
        }
        console.log(result);
        resolve(result[0].title); // Access the title property directly
      });
    });
  }

router.post("/", async (req, res) => {
  try {
    const { to, firstName, username, password } = req.body;
    await sendWelcomeMail(to, firstName, username, password);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});
router.post("/checkout", async (req, res) => {
    const {to, itemId} = req.body;
  try {
    const itemName = await getItemName("book",itemId);
    console.log(itemName);
    checkedOutMail(to, itemName);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

router.post("/waitlist", async (req, res) => {
  const {to, itemId} = req.body;
try {
  const itemName = await getItemName("book",itemId);
  console.log(itemName);
  waitlistMail(to, itemName);
  res.status(200).send("Email sent successfully!");
} catch (error) {
  console.error("Error sending email:", error);
  res.status(500).send("Error sending email");
}
});

router.post("/reserve", async (req, res) => {
  const {to, itemId} = req.body;
try {
  const itemName = await getItemName(itemId);
  console.log(itemName);
  reserveMail(to, itemName);
  res.status(200).send("Email sent successfully!");
} catch (error) {
  console.error("Error sending email:", error);
  res.status(500).send("Error sending email");
}
});
module.exports = router;
