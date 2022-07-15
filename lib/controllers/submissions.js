const { Router } = require('express');
const Submission = require('../models/Submission');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res) => {
  const allSubmissions = await Submission.getAllSubmissions();
  res.json(allSubmissions);
});
