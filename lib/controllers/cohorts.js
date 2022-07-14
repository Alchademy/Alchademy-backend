const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Cohort = require('../models/Cohorts'); 

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const allCohorts = await Cohort.getAll();
    res.json(allCohorts);
  });
