const pool = require('../utils/pool');

module.exports = class Tickets {
  id; 
  created_on;
  text;
  user_id;
  assignment_id;
  status_id;
  ta_id;

  constructor({ id, created_on, text, user_id, assignment_id, status_id, ta_id }){
    this.id = id;
    this.created_on = created_on;
    this.text = text;
    this.user_id = user_id;
    this.assignment_id = assignment_id;
    this.status_id = status_id;
    this.ta_id = ta_id;
  }

  static async getAllCurrent(ta_id){
    const { rows } = await pool.query(
      `SELECT * 
      FROM tickets 
      WHERE ta_id = $1 
      AND status_id IN (1, 2)`,
      [ta_id]
    );
    return rows.map(row => new Tickets(row));
  }
};
