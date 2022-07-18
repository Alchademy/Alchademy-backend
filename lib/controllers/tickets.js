const { Router } = require('express');

module.exports = Router()
  .get('/', async (req, res) => {
    const currentTickets = await Ticket.getAllCurrent(req.body.status);
    res.json(currentTickets);
  })
  
  
;

