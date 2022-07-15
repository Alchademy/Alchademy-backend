const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
const Syllabus = require('../models/Syllabus'); 

module.exports = Router()
  .get('/:id', async (req, res) => {
    const allCourses = await Syllabus.getByUser(req.params.id);
    res.json(allCourses);
  })
  .get('/', async (req, res) => {
    const allCourses = await Syllabus.getAll();
    res.json(allCourses);
  });
