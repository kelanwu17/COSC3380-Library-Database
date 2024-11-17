# Team 5 Library Database Project


## Technologies Used:

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)


### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) 

### Database
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square) 

### Version Control:
![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/-Vercel-000?logo=vercel&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Azure](https://img.shields.io/badge/-Azure-0078D4?logo=microsoft-azure&logoColor=white&style=flat-square)

## How to host website locally

### Cloning the repository
```bash
git clone https://github.com/kelanwu17/COSC3380-Library-Database.git
cd frontend
code .
```

### Deploying the website
```bash
cd frontend
npm install
npm start
```

### Deploying the backend/server
```bash
Backend:
cd backend
npm install
node app.js
```

Deployed Website: https://luminaarchives.vercel.app/

## Triggers

### Waitlist Trigger
This trigger is activated when an item that was fully checked out is returned or was previously unavailable. It ensures the waitlist is managed by notifying the next member in the queue about the availability of the item. It does this by sending an email to that user.
```
SHOW CREATE TRIGGER book_deactivate_earliest_waitlist_on_return;
DELIMITER //
CREATE DEFINER=`admin3380`@`%` TRIGGER `book_deactivate_earliest_waitlist_on_return` AFTER UPDATE ON `checkedoutbookhistory` FOR EACH ROW BEGIN
  -- Declare the variable at the start of the BEGIN block
  DECLARE earliest_waitlist_id INT;

  -- Check if the book has been returned
  IF NEW.timeStampReturn IS NOT NULL THEN
    -- Get the waitlistId of the earliest active waitlist entry for this book
    SELECT waitlistId
    INTO earliest_waitlist_id
    FROM waitlist
    WHERE itemId = NEW.bookId
      AND itemType = 'book'
      AND active = TRUE
    ORDER BY waitlistTimeStamp ASC
    LIMIT 1;

    -- If an active waitlist entry exists, deactivate it
    IF earliest_waitlist_id IS NOT NULL THEN
      UPDATE waitlist
      SET active = FALSE
      WHERE waitlistId = earliest_waitlist_id;
    END IF;
  END IF;
END
```

### Fines Trigger
This trigger is activated when a member fails to return a checked-out item by the due date. Once the item is returned, the trigger populates the Return Date and calculates the number of overdue days by finding the difference between the Return Date and the Due Date. The trigger then computes the total fine based on a daily overdue rate and adds this amount to the member's profile. The fine will be visible on the member's profile page once the item is returned
```
DELIMITER //
CREATE DEFINER=`admin3380`@`%` TRIGGER `add_fine_on_return` 
AFTER UPDATE ON `checkedoutbookhistory` 
FOR EACH ROW BEGIN
    DECLARE overdue_days INT; 
    IF NEW.timeStampReturn IS NOT NULL AND NEW.timeStampDue < NEW.timeStampReturn THEN
        SET overdue_days = DATEDIFF(NEW.timeStampReturn, NEW.timeStampDue);
        
        INSERT INTO Fines (itemId, itemType, memberId, fineAmount)
        VALUES (NEW.bookId, 'book', NEW.memberId, overdue_days * 1);
    END IF;
END
```

