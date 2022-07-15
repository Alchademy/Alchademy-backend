// this authorize keeps anyone but admins from seeing other cohorts stuff

// change method to check to see if the user is in that cohort - nothing comes up, throw error
const Cohort = require('../models/Cohort');

module.exports = async (req, res, next) => {
  try {
    const cohort = await Cohort.getById(req.params.id);
    if (!cohort) {
      if (req.user.role < 4)
        throw new Error('You do not have access to view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
