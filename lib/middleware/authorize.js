module.exports = async (req, res, next) => {
  try {
    if (!req.user)
      throw new Error('You do not have access to view this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};


//change all sql in models to include user_id, 
//update controller to call auth.js service post call, 
//write auth.js to check req.user.id versus user_id returned from model
