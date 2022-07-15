// this authorize keeps students from seeing other students assignments - but any who is a TA, teacher or admin can see all assignments
const Assignment = require('../models/Assignment');

// Need to change method for assignment
module.exports = async (req, res, next) => {
  try {
    const assignments = await Assignment.getByUserID(req.user.id);
    const assignment = assignments.filter(assignment => assignment.id === req.params.id);
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
