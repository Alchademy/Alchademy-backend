const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const { authorizeTA } = require('../services/authorize');
const Ticket = require('../models/Ticket');

module.exports = Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const singleTicket = await Ticket.getTicketById(req.params.id);
      res.json(singleTicket);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, authorizeTA, async (req, res) => {
    const currentTickets = await Ticket.getAllCurrent(req.user.id);
    res.json(currentTickets);
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newTicket = await Ticket.insert(req.body);
      res.json(newTicket);
    } catch (e) {
      next(e);
    }
  })
  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const updatedTicket = await Ticket.updateTicket(req.body, req.params.id);
      res.json(updatedTicket);
    } catch (e) {
      next(e);
    }
  });
