const { Router } = require('express');
const Syllabus = require('../models/Syllabus'); 

module.exports = Router()
  .get(`/${cohort_id}`, async (req, res) => {
    const allCourses = await Syllabus.getAll();
    res.json(allCourses);
  })