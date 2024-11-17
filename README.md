<p align="center">
  <img src="frontend/public/logo.png" alt="Logo" />
</p>
<hr style="border: 1px solid blue; width: 50%; margin: 20px auto;">

# Team 5 Library Database Project

This project was developed as part of the Database Systems (COSC 3380) course at the University of Houston. The objective was to design and implement a comprehensive database system and a full-stack website for a fictional library. The system, named Lumina Archives, integrates modern web technologies with database management to simulate the operations of a real-world library, allowing interaction between users, admins, and library resources.

## About 
Lumina Archives is a comprehensive library management system designed to enhance the user experience for both members and administrators. It provides a interface for browsing and managing books, music, and technology items, alongside  event management and member profile functionalities. With role-based access, the platform caters to students, faculty, and admins with tailored features such as item checkouts, waitlists, fines management, and administrative operations. The system prioritizes efficiency, accessibility, and accountability through automated triggers, dynamic reporting, and real-time updates. Whether you're exploring the catalog, managing library resources, or tracking operational data.


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
npm run dev
node app.js
```

Deployed Website: https://luminaarchives.vercel.app/

## 5 Project Requirements

## User Authentication for Different User Roles
Roles and Capabilities:

Members:
Students:
Can check out 1 item per category (Books, Music, Tech) and must return items within 1 week.
Faculty: 
Can check out 2 items per category and must return items within 2 weeks.
Common capabilities:
Browse catalogs (Books, Music, Tech).
Check out items, reserve items, and join waitlists.
View profile, including checked-out history, fines, and holds.
Manage event sign-ups and check-ins.

Admins:
General Admin:
Manage books, music, tech, events, and members (add, edit, deactivate).
Technicians:
Full access to manage all admin tasks, view reports, and track employee logs.
Librarians/Assistant Librarians: 
Can manage library items, members, and events but cannot access reports, employee logs, or manage other admins.

## Data Entry Forms

Add New Data:
Members:
Can self-register by providing required details (e.g., name, DOB, email, role).
Admins:
Add new books, music, and tech items to the catalog.
Create new events.
Add new members to the system.

Modify Existing Data:
Members:
Update their profile details.
Reserve or waitlist items from the catalog.
Sign up for events and check-in when active.
Admins:
Update item details (e.g., availability, title).
Edit member information (excluding username and password).

Delete Data:
Admins:
Deactivate items, events, or member accounts instead of deleting, ensuring historical accuracy.

## Data Queries

### Queries Supported:

Catalog Search Queries:

Retrieve items by title, genre, or availability status for books, music, and tech.
Checked-Out Items Query:

Retrieve a list of items currently checked out, including due dates and member details.
Member Profile Query:

Retrieve member information, including checked-out history, fines, and reservations.
Waitlist Query:

Retrieve the queue for waitlisted items with member signup order.



### Reports for Admins (Technician Role Only):
### Fines Report:

Displays total fines collected over time, filtered by date range.
Includes:
Total fines collected.
List of members with outstanding fines.
Bar graph of fines collected over time.

### Checked-Out Books Report:

Displays statistics on books checked out, filtered by category or time range.
Includes:
Total books checked out.
Average return time.
List of books currently checked out.
Line graph of book checkouts over time.

### Checked-Out Music Report:

Similar to the books report but focused on music items.
Includes:
Total music items checked out.
List of members who checked out music items.
Pie chart of genres most frequently checked out.


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

## Addtional Notes
Improvements to be made:

- fix time zones conversion
- add drop down menu for 
    - roles in manage member   
    - age category in manage books
    - event creater/holder with admin name instead of ID
- add active status in manage books/tech
- make UI desgin consistent throught the webiste 


