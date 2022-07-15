const { Router } = require('express');
const Submission = require('../models/Submission');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedSubmission = await Submission.updateSubmission(id, req.body);
      res.json(updatedSubmission);
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const newSubmission = await Submission.addSubmission(req.body);
      res.json(newSubmission);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const singleSubmission = await Submission.getSubmissionById(
        req.params.id
      );
      res.json(singleSubmission);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const allSubmissions = await Submission.getAllSubmissionsByUserId(
        req.body
      );
      res.json(allSubmissions);
    } catch (e) {
      next(e);
    }
  });
