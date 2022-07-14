const { Router } = require('express');

module.exports = Router()
  .get('/', async (req, res) => {
    const allAssignments = await Assignment.getAll();
    res.json(allAssignments);
  });
  