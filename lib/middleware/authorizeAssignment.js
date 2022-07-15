// this authorize keeps students from seeing other students assignments - but any who is a TA, teacher or admin can see all assignments
const Assignment = require('../models/Assignment');

// Need to change method for assignment
module.exports = async (req, res, next) => {
  try {
    const assignment = await Assignment.getById(req.params.id);
    if (!assignment) {
      if (req.user.role < 2)
        throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
