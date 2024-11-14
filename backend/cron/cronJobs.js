const cron = require('node-cron');
const db = require('../config/db'); // Adjust the path as necessary to import your database connection

// Function to disable library cards for overdue books
const disableCardsForOverdueBooks = () => {
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
      console.error('Error disabling cards for overdue books:', error.message);
    } else {
      console.log('Library cards disabled for overdue books.');
    }
  });
};

// Function to disable library cards for overdue music items
const disableCardsForOverdueMusic = () => {
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
      console.error('Error disabling cards for overdue music items:', error.message);
    } else {
      console.log('Library cards disabled for members with overdue music items.');
    }
  });
};

// Function to disable library cards for overdue tech items
const disableCardsForOverdueTech = () => {
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
      console.error('Error disabling cards for overdue tech items:', error.message);
    } else {
      console.log('Library cards disabled for members with overdue tech items.');
    }
  });
};

// Schedule the cron jobs (adjust the timing as necessary)
// This example runs the tasks every day at midnight
cron.schedule('0 0 * * *', disableCardsForOverdueBooks); // Daily at midnight
cron.schedule('0 0 * * *', disableCardsForOverdueMusic); // Daily at midnight
cron.schedule('0 0 * * *', disableCardsForOverdueTech); // Daily at midnight

console.log('Cron jobs for disabling library cards scheduled.');
