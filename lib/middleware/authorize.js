module.exports = async (req, res, next) => {
  try {
    console.log('req.user', req.user);
    console.log('req.body', req.body);
    if (!req.user || String(req.user.id) !== String(req.body.user_id))
      throw new Error('You do not have access to view this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
