const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Ticket = require('../models/Ticket');

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const currentTickets = await Ticket.getAllCurrent(req.user.id, req.body.status);
    res.json(currentTickets);
  })
  
  
;

