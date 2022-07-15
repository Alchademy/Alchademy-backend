const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Assignment = require('../models/Assignment');


module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try{
      const allAssignments = await Assignment.getAll(req.body);
      res.json(allAssignments);
    }catch(e){
      next(e);
    }
  })
  .get('/:id', authenticate, async (req, res, next) => {
    try{
      const singularAssignment = await Assignment.getByID(req.params.id);
      res.json(singularAssignment);
    }catch(e){
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try{
      const newAssignment = await Assignment.insert(req.body);
      res.json(newAssignment);
    }catch(e){
      next(e);
    }
  })
  .put('/:id', authenticate, async (req, res, next) => {
    try{
      const updatedAssignment = await Assignment.update(req.params.id, req.body);
      res.json(updatedAssignment);
    }catch(e){
      next(e);
    }
  })
  .delete('/:id', authenticate, async (req, res, next) => {
    try{
      const deleteAssignment = await Assignment.delete(req.params.id);
      res.json(deleteAssignment);
    }catch(e){
      next(e);
    }
  })
;
    
