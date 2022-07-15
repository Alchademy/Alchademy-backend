const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Syllabus = require('../models/Syllabus'); 

module.exports = Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const singleCourse = await Syllabus.getById(req.params.id);
      res.json(singleCourse);
    } catch (e) {
      next(e);
    }
  })

  .get('/user/:id', authenticate, async (req, res, next) => {
    try {
      const allCourses = await Syllabus.getByUser(req.params.id);
      res.json(allCourses);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const allCourses = await Syllabus.getAll();
      res.json(allCourses);
    } catch (e) {
      next(e);
    }
  })
  
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newCourse = await Syllabus.create(req.body);
      res.json(newCourse);
    } catch (e) {
      next(e);
    }
  })
  
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const deletedCourse = await Syllabus.delete(req.params.id);
      res.json(deletedCourse);
    } catch (e) {
      next(e);
    }
  })
  
  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const updatedSyllabus = await Syllabus.updateById(req.params.id, req.body);
      res.json(updatedSyllabus);
    } catch (e) {
      next(e);
    }
  });
