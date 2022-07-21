const { Router } = require('express');
const Submission = require('../models/Submission');
const authenticate = require('../middleware/authenticate');
const authorizeSubmission = require('../middleware/authorizeSubmission');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const authorizeTA = require('../middleware/authorizeTA');
const authorize = require('../middleware/authorize');

module.exports = Router()
  // authorizeSubmission, authorizeTA?
  .put('/:id', authenticate, authorizeTA, async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedSubmission = await Submission.updateSubmission(id, req.body);
      res.json(updatedSubmission);
    } catch (e) {
      next(e);
    }
  })
  // authorizeSubmission?
  .post('/', authenticate, authorize, async (req, res, next) => {
    try {
      const newSubmission = await Submission.addSubmission(req.body);
      res.json(newSubmission);
    } catch (e) {
      next(e);
    }
  })
  // authorizeSubmission?
  .get('/:id', authenticate, authorizeSubmission, async (req, res, next) => {
    try {
      const singleSubmission = await Submission.getSubmissionById(
        req.params.id
      );
      res.json(singleSubmission);
    } catch (e) {
      next(e);
    }
  })
  // authorizeSubmissions?
  .get('/', authenticate, authorizeSubmission, async (req, res, next) => {
    try {
      const allSubmissions = await Submission.getAllSubmissionsByUserId(req.user.id);
      res.json(allSubmissions);
    } catch (e) {
      next(e);
    }
  })
  // authorizeSubmission? authorizeTeacher? authorizeAdmin?
  .delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedSubmission = await Submission.deleteSubmissionById(id);
      res.json(deletedSubmission);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/assignment/:id', authenticate, authorizeSubmission, async (req, res, next) => {
    try {
      const allSubmissions = await Submission.getAllSubmissionsByUserAndAssignment(req.user.id, req.params.id);
      res.json(allSubmissions);
    } catch (e) {
      next(e);
    }
  });
