const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://alchademy.herokuapp.com',
      'https://alchademy.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
app.use('/github', require('./controllers/githubUsers'));
app.use('/syllabus', require('./controllers/syllabus'));
app.use('/submissions', require('./controllers/submissions'));
app.use('/cohorts', require('./controllers/cohorts'));
app.use('/assignments', require('./controllers/assignments'));
app.use('/tickets', require('./controllers/tickets'));
app.use('/comments', require('./controllers/comments'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
