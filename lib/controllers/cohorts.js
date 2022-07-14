const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
const Cohort = require('../models/Cohorts'); 

module.exports = Router()
  .get('/:id', async (req, res) => {
    const singleCohort = await Cohort.getCohortById(req.params.id);
    res.json(singleCohort);
  })

  .get('/', async (req, res) => {
    const allCohorts = await Cohort.getAll();
    res.json(allCohorts);
  });
