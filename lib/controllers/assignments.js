const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const {
  authorizeAssignment,
  authorizeTA,
  authorizeTeacher,
} = require('../services/authorize');
const Assignment = require('../models/Assignment');

module.exports = Router()
  // give access to students under a specific syllabus
  .get(
    '/syllabus/:id',
    authenticate,
    authorizeAssignment,
    async (req, res, next) => {
      try {
        const allAssignments = await Assignment.getAll(req.params.id);
        res.json(allAssignments);
      } catch (e) {
        next(e);
      }
    }
  )
  .get(
    '/user/syllabus/:id',
    authenticate,
    authorizeAssignment,
    async (req, res, next) => {
      try {
        const allAssignmentsAndSubmissions =
          await Assignment.getAllAssignmentsWithGradesBySyllabusIdAndUserId(
            req.params.id,
            req.user.id
          );
        res.json(allAssignmentsAndSubmissions);
      } catch (e) {
        next(e);
      }
    }
  )
  //allow access to assignments that have been give to a student
  .get('/:id', authenticate, authorizeAssignment, async (req, res, next) => {
    try {
      const singularAssignment = await Assignment.getByID(req.params.id);
      res.json(singularAssignment);
    } catch (e) {
      next(e);
    }
  })
  //allow access only for teachers and admins
  .post('/', authenticate, authorizeTeacher, async (req, res, next) => {
    try {
      const newAssignment = await Assignment.insert(req.body);
      res.json(newAssignment);
    } catch (e) {
      next(e);
    }
  })
  //allow access to teacher and admin
  .put('/:id', authenticate, authorizeTA, async (req, res, next) => {
    try {
      const updatedAssignment = await Assignment.update(
        req.params.id,
        req.body
      );
      res.json(updatedAssignment);
    } catch (e) {
      next(e);
    }
  })
  //allow access only for teach and assignment
  .delete('/:id', authenticate, authorizeTeacher, async (req, res, next) => {
    try {
      const deleteAssignment = await Assignment.delete(req.params.id);
      res.json(deleteAssignment);
    } catch (e) {
      next(e);
    }
  });
