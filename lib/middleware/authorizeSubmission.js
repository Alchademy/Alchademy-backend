// this authorize keeps students from seeing other students submission - but any who is a TA, teacher or admin can see all submission
const Submission = require('../models/Submission');

module.exports = async (req, res, next) => {
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
