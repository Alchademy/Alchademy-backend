const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Assignment = require('../models/Assignment');


module.exports = Router()
  .get('/', async (req, res, next) => {
    try{
      const allAssignments = await Assignment.getAll(req.body);
      res.json(allAssignments);
    }catch(e){
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try{
      const newAssignment = await Assignment.insert(req.body);
      res.json(newAssignment);
    }catch(e){
      next(e);
    }
  })
  .put('/:id', async (req, res, next) => {
    try{
      const updatedAssignment = await Assignment.update(req.params.id, req.body);
      res.json(updatedAssignment);
    }catch(e){
      next(e);
    }
  })
;
    
