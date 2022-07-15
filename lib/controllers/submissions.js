const { Router } = require('express');
const Submission = require('../models/Submission');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const allSubmissions = await Submission.getAllSubmissions(req.body);
    res.json(allSubmissions);
  } catch (e) {
    next(e);
  }
});
