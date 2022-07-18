const pool = require('../utils/pool');

module.exports = class Tickets {
  id; 
  created_on;
  text;
  user_id;
  assignment_id;
  status;

  constructor({ id, created_on, text, user_id, assignment_id, status }){
    this.id = id;
    this.created_on = created_on;
    this.text = text;
    this.user_id = user_id;
    this.assignment_id = assignment_id;
    this.status = status;
  }

  static async getAllCurrent(status){
    const { rows } = await pool.query(
      `SELECT * 
        FROM tickets
        WHERE status = $1`,
      [status]
    );
    return rows.map(row => new Tickets(row));
  }
};
