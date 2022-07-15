// this would be like a combo Teacher & Admin authorize - could just do authorizeAdmin, but I think it might make sense to allow the teacher (owner_id) to edit, etc.
const Syllabus = require('../models/Syllabus');

module.exports = async (req, res, next) => {
  try {
    const syllabus = await Syllabus.getById(req.params.id);
    if (
      !syllabus ||
      req.user.id !== syllabus.owner_id ||
      req.user.id !== syllabus.created_by
    )
      throw new Error('You do not have access to view this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
