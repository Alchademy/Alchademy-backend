// authorize for when we want to keep ALL students off a route

module.exports = async (req, res, next) => {
  try {
    if (!req.user || req.user.role < 2)
      throw new Error('You do not have permission to do that');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
