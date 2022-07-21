const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { authorize, authorizeTeacher } = require('../services/authorize');
const Cohort = require('../models/Cohort');

module.exports = Router()
  .get('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const singleCohort = await Cohort.getCohortByIdAndUser(
        req.params.id,
        req.user.id
      );
      if (!singleCohort)
        throw new Error('You do not have access to this record!');
      res.json(singleCohort);
    } catch (e) {
      next(e);
    }
  })

  .get('/user/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const singleCohort = await Cohort.getCohortByUserId(req.user.id);
      res.json(singleCohort);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, authorizeTeacher, async (req, res) => {
    const allCohorts = await Cohort.getAll();
    res.json(allCohorts);
  })

  .post('/', authenticate, authorizeTeacher, async (req, res, next) => {
    try {
      const newCohort = await Cohort.create(req.body);
      res.json(newCohort);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authenticate, authorizeTeacher, async (req, res, next) => {
    try {
      const deletedRecipe = await Cohort.delete(req.params.id);
      res.json(deletedRecipe);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authenticate, authorizeTeacher, async (req, res, next) => {
    try {
      const updatedCohort = await Cohort.updateById(
        req.params.id,
        req.body,
        req.user.id
      );
      if (!updatedCohort)
        throw new Error('You do not have access to this record!');
      res.json(updatedCohort);
    } catch (error) {
      next(error);
    }
  });
