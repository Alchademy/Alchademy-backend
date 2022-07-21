const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// general authorize
const authorize = async (req, res, next) => {
  try {
    if (!req.user) throw new Error('You do not have access to view this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

//authorize TA
// authorize for when we want to keep ALL students off a route
const authorizeTA = async (req, res, next) => {
  try {
    if (!req.user || req.user.role < 2)
      throw new Error('You do not have permission to do that');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

//authorize teacher
// authorize for when we want to keep ALL students & TAs off a route
const authorizeTeacher = async (req, res, next) => {
  try {
    if (!req.user || req.user.role < 3)
      throw new Error('You must have Teacher privileges to access this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

// authorize admin
// authorize for when we want to keep ALL students, TAs, and teachers off a route
const authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role < 4)
      throw new Error('You do not have permission to do that');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

// authorize assignment
// this authorize keeps students from seeing other students assignments - but any who is a TA, teacher or admin can see all assignments
const authorizeAssignment = async (req, res, next) => {
  try {
    const assignments = await Assignment.getByUserID(req.user.id);
    const assignment = assignments.filter(
      (assignment) => assignment.id === req.params.id
    );
    if (!assignment) {
      if (req.user.role < 2)
        throw new Error('Please speak to your admin about access');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

//authorize submission
// this authorize keeps students from seeing other students submission - but any who is a TA, teacher or admin can see all submission
const authorizeSubmission = async (req, res, next) => {
  try {
    const submissions = await Submission.getAllSubmissionsByUserId(req.user.id);
    const submission = submissions.filter(
      (submission) => submission.id === req.params.id
    );
    if (!submission) {
      if (req.user.role < 2)
        throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};

module.exports = {
  authorize,
  authorizeTA,
  authorizeTeacher,
  authorizeAdmin,
  authorizeAssignment,
  authorizeSubmission,
};
