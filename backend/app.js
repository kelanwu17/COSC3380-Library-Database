const express = require("express");
const cors = require("cors");

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3001;

const loginRouter = require('./auth/login');
const memberRouter = require('./routes/member');
const adminRouter = require('./routes/admin');
const booksRouter = require('./routes/books');
const musicRouter = require('./routes/music');
const technologyRouter = require('./routes/technology');
const eventRouter = require('./routes/event');
const finesRouter = require('./routes/fines');
const waitlistRouter = require('./routes/waitlist');
const libraryCardRouter = require('./routes/libraryCard');
const checkedOutBookHistoryRouter = require('./routes/checkedoutbookhistory');
const checkedOutMusicHistoryRouter = require('./routes/checkedoutmusichistory');
const checkedOutTechHistoryRouter = require('./routes/checkedouttechhistory');
const bookInstanceRouter = require('./routes/bookInstance');
const musicInstanceRouter = require('./routes/musicInstance');
const techInstanceRouter = require('./routes/techInstance');
const employeeLogRouter = require('./routes/employeelog');
const eventSignUpRouter = require('./routes/eventSignUp');
const reserveRouter = require('./routes/reserve');
const testRouter = require('./routes/test');


app.use(express.json());
app.use(cors());

app.use("/auth/login", loginRouter);

app.use("/api/member", memberRouter);
app.use("/api/admin", adminRouter);
app.use("/api/books", booksRouter);
app.use("/api/music", musicRouter);
app.use("/api/technology", technologyRouter);
app.use("/api/event", eventRouter);
app.use("/api/fines", finesRouter);
app.use("/api/waitlist", waitlistRouter);
app.use("/api/libraryCard", libraryCardRouter);
app.use("/api/checkoutbook", checkedOutBookHistoryRouter);
app.use("/api/checkoutmusic", checkedOutMusicHistoryRouter);
app.use("/api/checkouttech", checkedOutTechHistoryRouter);
app.use("/api/bookInstance", bookInstanceRouter);
app.use("/api/musicInstance", musicInstanceRouter);
app.use("/api/techInstance", techInstanceRouter);
app.use("/api/employeeLog", employeeLogRouter);
app.use("/api/eventSignUp", eventSignUpRouter);
app.use("/api/reserve/", reserveRouter);
app.use("/test", testRouter);
require('./cron/cronJobs');


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
