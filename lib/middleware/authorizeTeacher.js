// authorize for when we want to keep ALL students & TAs off a route

module.exports = async (req, res, next) => {
  try {
    if (!req.user || req.user.role < 3)
      throw new Error('You must have Teacher privileges to access this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
