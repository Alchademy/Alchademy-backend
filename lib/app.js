const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// App routes
app.use('/github', require('./controllers/githubUsers'));
app.use('/syllabus', require('./controllers/syllabus'));
app.use('/submissions', require('./controllers/submissions'));
app.use('/cohorts', require('./controllers/cohorts'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
