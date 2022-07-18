const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTA = require('../middleware/authorizeTA');
const Ticket = require('../models/Ticket');

module.exports = Router()
  .get('/', authenticate, authorizeTA, async (req, res) => {
    const currentTickets = await Ticket.getAllCurrent(req.user.id);
    res.json(currentTickets);
  })
  .get('/:id', authenticate, async (req, res) => {
    const userTicket = await Ticket.getUserTicket(req.user.id, req.body.status);

  })
  
;

