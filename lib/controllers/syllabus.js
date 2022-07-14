const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Syllabus = require('../models/Syllabus'); 

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const allCourses = await Syllabus.getAll();
    res.json(allCourses);
  });
