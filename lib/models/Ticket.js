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

  static async getAllCurrent(ta_id, status_id){
    const { rows } = await pool.query(
      `SELECT * 
        FROM tickets
        WHERE status_id = $1 AND ta_id =$2`,
      [status_id, ta_id]
    );
    return rows.map(row => new Tickets(row));
  }
};
