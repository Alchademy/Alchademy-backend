const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Cohort = require('../models/Cohort');

module.exports = Router()
  .get('/:id', authenticate, async (req, res) => {
    const singleCohort = await Cohort.getCohortById(req.params.id);
    res.json(singleCohort);
  })

  .get('/', authenticate, async (req, res) => {
    const allCohorts = await Cohort.getAll();
    res.json(allCohorts);
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const newCohort = await Cohort.create(req.body);
      res.json(newCohort);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const deletedRecipe = await Cohort.delete(req.params.id);
      res.json(deletedRecipe);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const updatedCohort = await Cohort.updateById(req.params.id, req.body);
      res.json(updatedCohort);
    } catch (error) {
      next(error);
    }
  });
