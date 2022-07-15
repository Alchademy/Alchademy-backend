const { Router } = require('express');
const Submission = require('../models/Submission');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
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
      // console.log('DELANEYS REQ.BODY', req.body);
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
